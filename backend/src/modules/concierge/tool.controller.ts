import { Body, Controller, Post } from '@nestjs/common';
import { ToolLogService } from './tool.service';
import { CreateToolLogDto } from './dto/tool.dto';

@Controller('tool-logs')
export class ToolLogController {
  constructor(private readonly service: ToolLogService) {}

  @Post()
  create(@Body() req: CreateToolLogDto) {
    return this.service.create(req)
  }
}