import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MessageService } from '../concierge/message.service';
import { AiService } from '../ai/ai.service';
import { Message } from '../concierge/message.entity';
import { ToolCallService } from '../concierge/tool.service';
import { ToolCall } from '../concierge/tool.entity';
import { AttendeeService } from '../attendee/attendee.service';
import { Attendee } from '../attendee/attendee.entity';
import { EmbeddingService } from '../ai/embedding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Message, ToolCall, Attendee])],
  controllers: [EventController],
  providers: [
    EventService,
    MessageService,
    AiService,
    ToolCallService,
    AttendeeService,
    EmbeddingService,
  ],
})
export class EventModule {}
