import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateToolCallDto {
  @IsString()
  message_id: string;

  @IsString()
  tool_name: string;

  @IsObject()
  input: any;

  @IsObject()
  @IsOptional()
  output: any;
}
