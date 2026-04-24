import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventDto,
  EventFilter,
  SendMessageDto,
  UpdateEventDto,
} from './dto/event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() filter: EventFilter) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() req: UpdateEventDto) {
    return this.service.update(id, req);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/concierge/messages')
  sendMessage(@Param('id') id: string, @Body() req: SendMessageDto) {
    return this.service.eventSendMessages(id, req);
  }
}
