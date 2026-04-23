import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
  ) {}

  create(req: CreateMessageDto) {
    const message = this.repo.create(req);
    return this.repo.save(message);
  }

  findAllByEventAndAttendee(eventId: string, attendeeId: string) {
    return this.repo.find({
      where: {
        event_id: eventId,
        attendee_id: attendeeId,
      },
      order: {
        created_at: 'ASC',
      },
    });
  }
}
