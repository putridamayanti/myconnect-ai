import { IsString, IsDateString, IsObject } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  event_id: string;

  @IsString()
  attendee_id: string;

  @IsString()
  role: string;

  @IsObject()
  content: any;
}