import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/message.dto';
import { Attendee } from '../attendee/attendee.entity';
import { AttendeeService } from '../attendee/attendee.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
    private attendeeService: AttendeeService,
    private aiService: AiService,
  ) {}

  private buildIntroPrompt(
    from: Partial<Attendee> | null,
    to: Partial<Attendee> | null,
    context?: string,
  ) {
    return `
    You are helping write a professional networking message.

    From:
    ${from?.name} - ${from?.role}
    Looking for: ${from?.looking_for}
    
    To:
    ${to?.name} - ${to?.role} at ${to?.company}
    Looking for: ${to?.looking_for}
    
    Shared context:
    ${context || 'N/A'}
    
    Write a concise, friendly intro message (3-5 sentences).
    Avoid being generic. Be specific to their shared interests.
    `;
  }

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

  async draftIntroMessage(args: any, attendeeId: any) {
    const { to = '', context = '' } = args;
    const source = await this.attendeeService.findById(attendeeId);
    const candidate = await this.attendeeService.findByName(to);

    if (!source || !candidate) {
      return { data: '' };
    }

    try {
      const prompt = this.buildIntroPrompt(source, candidate, context);
      const res = await this.aiService.generateContent(prompt);

      return {
        data: res.text,
      };
    } catch (error) {
      this.aiService['logger'].error({ error }, 'Error drafting intro message');
      return {
        data: 'I was unable to draft a message at this time. Please try again later.',
      };
    }
  }
}
