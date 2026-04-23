import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateAttendeeDto {
  @IsString()
  name: string;

  @IsString()
  headline: string;

  @IsString()
  bio: string;

  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  looking_for: string;

  @IsBoolean()
  open_to_chat: boolean;
}

export class UpdateAttendeeDto {
  @IsString()
  name: string;

  @IsString()
  headline: string;

  @IsString()
  bio: string;

  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  looking_for: string;

  @IsBoolean()
  open_to_chat: boolean;
}

export class AttendeeBaseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  headline: string;

  @IsString()
  bio: string;

  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  looking_for: string;

  @IsBoolean()
  open_to_chat: boolean;
}
