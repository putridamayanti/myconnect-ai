import { Body, Controller, Post } from '@nestjs/common';
import { ToolCallService } from './tool.service';
import { CreateToolCallDto } from './dto/tool.dto';

@Controller('tool-calls')
export class ToolCallController {
  constructor(private readonly service: ToolCallService) {}

  @Post()
  create(@Body() req: CreateToolCallDto) {
    return this.service.create(req);
  }
}
