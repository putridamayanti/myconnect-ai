import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, SendMessageDto } from './dto/event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() req: any) {
    return this.service.update(id, req);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/concierge/messages')
  sendMessage(@Param('id') id: string, @Body() req: SendMessageDto) {
    return this.service.sendMessage(id, req);
  }
}
