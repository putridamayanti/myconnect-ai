import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto, FeedbackFilter } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private repo: Repository<Feedback>,
  ) {}

  create(dto: CreateFeedbackDto) {
    const feedback = this.repo.create(dto);
    return this.repo.save(feedback);
  }

  async findAll(filter: FeedbackFilter) {
    const query = this.repo.createQueryBuilder('Feedback');

    query.orderBy(`Feedback.${filter.sort_by}`, filter.sort_order);

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

  update(id: string, req: Partial<Feedback>) {
    return this.repo.update(id, req);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
