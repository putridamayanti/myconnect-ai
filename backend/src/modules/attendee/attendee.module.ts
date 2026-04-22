import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeController } from './attendee.controller';
import { AttendeeService } from './attendee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [AttendeeController],
  providers: [AttendeeService]
})
export class AttendeeModule {}
