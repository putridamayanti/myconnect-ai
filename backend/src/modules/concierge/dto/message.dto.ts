import { IsString, IsObject } from 'class-validator';
import { MessageRole } from '../message.entity';

export class CreateMessageDto {
  @IsString()
  event_id: string;

  @IsString()
  attendee_id: string;

  @IsString()
  role: MessageRole;

  @IsObject()
  content: any;
}
