import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeController } from './attendee.controller';
import { AttendeeService } from './attendee.service';
import { EmbeddingService } from '../ai/embedding.service';
import { AiService } from '../ai/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [AttendeeController],
  providers: [AttendeeService, EmbeddingService, AiService],
})
export class AttendeeModule {}
