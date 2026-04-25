import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ToolCallService } from './tool.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ToolCall } from './tool.entity';
import { AttendeeService } from '../attendee/attendee.service';
import { Attendee } from '../attendee/attendee.entity';
import { EmbeddingService } from '../ai/embedding.service';
import { AiService } from '../ai/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, ToolCall, Attendee])],
  providers: [
    MessageService,
    ToolCallService,
    AttendeeService,
    EmbeddingService,
    AiService,
  ],
})
export class ConciergeModule {}
