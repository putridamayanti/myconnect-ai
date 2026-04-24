import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ResponseDto {
  @IsNumber()
  status_code: number;

  @IsObject()
  @IsOptional()
  data: any;

  @IsString()
  @IsOptional()
  error: string;

  @IsString()
  message: string = '';

  constructor(partial: Partial<ResponseDto>) {
    Object.assign(this, partial);
  }
}
