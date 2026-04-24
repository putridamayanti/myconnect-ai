import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  IsIn,
  IsInt,
  Min,
} from 'class-validator';

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

export class AttendeeFilter {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  open_to_chat: boolean;

  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
