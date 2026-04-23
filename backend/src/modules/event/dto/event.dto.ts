import { IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class SendMessageDto {
  @IsString()
  attendee_id: string;

  @IsString()
  message: string;
}
