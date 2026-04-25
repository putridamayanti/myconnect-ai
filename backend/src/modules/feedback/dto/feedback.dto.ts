import {
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeedbackDto {
  @IsOptional()
  @IsString()
  message_id: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateFeedbackDto {
  @IsNumber()
  rating: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class FeedbackFilter {
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
