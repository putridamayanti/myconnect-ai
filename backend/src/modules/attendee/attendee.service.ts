import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendeeDto, UpdateAttendeeDto } from './dto/attendee.dto';
import { EmbeddingService } from '../ai/embedding.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private repo: Repository<Attendee>,
    private dataSource: DataSource,
    private embeddingService: EmbeddingService,
    private aiService: AiService,
  ) {}

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

  private buildReasonPrompt(
    source: Partial<Attendee> | null,
    candidate: Partial<Attendee> | null,
    shared: string[],
  ) {
    return `
      Explain why these two attendees are a good match.
      Source:
      ${JSON.stringify(source)}
      
      Candidate:
      ${JSON.stringify(candidate)}
      
      Shared:
      ${shared.join(', ')}
      
      Keep it concise (2-3 sentences).
      `;
  }

  async create(dto: CreateAttendeeDto) {
    const attendee = this.repo.create(dto);

    const text = this.buildProfile(attendee);
    attendee.embedding = await this.embeddingService.geminiEmbed(text);

    return this.repo.save(attendee);
  }

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOneBy({ id: id });
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
      LIMIT 10
    `,
      [vector, eventId],
    );

    return { data: res };
  }

  async scoreMatch(sourceAttendeeId: string, attendeeId: string) {
    const sourceAttendee = await this.repo.findOneBy({ id: sourceAttendeeId });
    const attendee = await this.repo.findOneBy({ id: attendeeId });

    let score = 0;
    let sharedItems: string[] = [];

    const overlapSkills = sourceAttendee?.skills.filter((e) =>
      attendee?.skills?.includes(e),
    );

    if (overlapSkills && overlapSkills.length > 0) {
      score += overlapSkills.length * 10;
      sharedItems = [...sharedItems, ...overlapSkills];
    }

    if (
      sourceAttendee?.role &&
      attendee?.looking_for
        ?.toLowerCase()
        .includes(sourceAttendee?.role?.toLowerCase())
    ) {
      score += 25;
      sharedItems = [...sharedItems, attendee?.looking_for];
    }

    score = Math.min(score, 100);

    const reasonPrompt = this.buildReasonPrompt(
      sourceAttendee,
      attendee,
      sharedItems,
    );
    const reason = await this.aiService.generateContent(reasonPrompt);

    return {
      data: {
        score,
        reason,
      },
    };
  }
}
