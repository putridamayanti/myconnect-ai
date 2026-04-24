import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AttendeeFilter,
  CreateAttendeeDto,
  UpdateAttendeeDto,
} from './dto/attendee.dto';
import { EmbeddingService } from '../ai/embedding.service';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private repo: Repository<Attendee>,
    private dataSource: DataSource,
    private embeddingService: EmbeddingService,
  ) { }

  private buildProfile(attendee: Partial<Attendee>): string {
    return `
      Name: ${attendee.name}
      Bio: ${attendee.bio}
      Headline: ${attendee.headline}
      Company: ${attendee.company}
      Role: ${attendee.role}
      Skills: ${attendee?.skills?.join(', ')}
      Looking for: ${attendee.looking_for}
      Open to chat: ${attendee.open_to_chat}
    `;
  }

  async create(dto: CreateAttendeeDto) {
    const attendee = this.repo.create(dto);

    const text = this.buildProfile(attendee);
    attendee.embedding = await this.embeddingService.geminiEmbed(text);

    return this.repo.save(attendee);
  }

  async findAll(filter: AttendeeFilter) {
    const query = this.repo.createQueryBuilder('attendee');

    if (filter.search) {
      query.andWhere(
        '(LOWER(attendee.name) LIKE LOWER(:search) OR LOWER(attendee.headline) LIKE LOWER(:search) OR LOWER(attendee.role) ' +
        'LIKE LOWER(:search) OR LOWER(attendee.looking_for) LIKE LOWER(:search))',
        { search: `%${filter.search}%` },
      );
    }

    if (filter.skills && filter.skills.length > 0) {
      query.andWhere('attendee.skill IN (:...skills)', {
        skills: filter.skills,
      });
    }

    if (filter.open_to_chat !== undefined) {
      query.andWhere('attendee.open_to_chat = :open_to_chat', {
        open_to_chat: filter.open_to_chat,
      });
    }

    query.orderBy(`attendee.${filter.sort_by}`, filter.sort_order);

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  findById(id: string) {
    return this.repo.findOneBy({ id: id });
  }

  findByName(name: string) {
    return this.repo.findOneBy({ name: name });
  }

  async update(id: string, req: UpdateAttendeeDto) {
    const attendee = this.repo.create({ id, ...req });

    const text = this.buildProfile(attendee);
    attendee.embedding = await this.embeddingService.geminiEmbed(text);

    const res = await this.repo.update(id, attendee);
    if (res?.affected === 0) {
      return null;
    }

    return attendee;
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async search(eventId: string, query: any): Promise<any> {
    const queryEmbed = await this.embeddingService.geminiEmbed(query);
    const vector = `[${queryEmbed.join(',')}]`;

    const res: any[] = await this.dataSource.query(
      `
      SELECT *,
        (embedding <-> $1) AS distance
      FROM attendees
      WHERE event_id = $2
        AND open_to_chat = true
      ORDER BY distance ASC
      LIMIT 5
    `,
      [vector, eventId],
    );

    return { data: res };
  }

  async scoreMatch(sourceAttendeeId: string, attendeeId: string) {
    const sourceAttendee = await this.repo.findOneBy({ id: sourceAttendeeId });
    const attendee = await this.repo.findOneBy({ id: attendeeId });

    const resp = await fetch(`${process.env.ENGINE_API_URL}/scores`, {
      method: 'POST',
      body: JSON.stringify({
        source: sourceAttendee,
        candidate: attendee,
      }),
    });

    const result: any = await resp.json();

    if (!resp.ok) {
      return { error: result?.error ?? 'Failed to calculate the score' };
    }

    return {
      data: result,
    };
  }
}
