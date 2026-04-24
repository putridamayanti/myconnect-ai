import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToolCall } from './tool.entity';
import { Repository } from 'typeorm';
import { CreateToolCallDto } from './dto/tool.dto';
import { AttendeeService } from '../attendee/attendee.service';
import { MessageService } from './message.service';

@Injectable()
export class ToolCallService {
  constructor(
    @InjectRepository(ToolCall)
    private repo: Repository<ToolCall>,
    private attendeeService: AttendeeService,
    private messageService: MessageService,
  ) {}

  create(req: CreateToolCallDto) {
    const log = this.repo.create(req);
    return this.repo.save(log);
  }

  executeTool(
    toolName: string,
    args: any,
    eventId: string,
    attendeeId: string,
  ) {
    switch (toolName) {
      case 'search_attendees':
        return this.attendeeService.search(eventId, args.query);
      case 'score_match':
        return this.attendeeService.scoreMatch(
          args.sourceAttendeeId,
          attendeeId,
        );
      case 'draft_intro_message':
        return this.messageService.draftIntroMessage(args, attendeeId);
      default:
        return null;
    }
  }
}
