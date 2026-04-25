import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, EventFilter, SendMessageDto } from './dto/event.dto';
import { CreateFeedbackDto } from '../feedback/dto/feedback.dto';
import { ResponseDto } from '../../common/dto/response.dto';

@Controller('events')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Post()
  async create(@Body() dto: CreateEventDto): Promise<ResponseDto> {
    const result = await this.service.create(dto);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Event created successfully',
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() filter: EventFilter) {
    const result = await this.service.findAll(filter);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Events fetched successfully',
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.service.findById(id);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Event fetched successfully',
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() req: any) {
    const result = await this.service.update(id, req);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Event updated successfully',
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Event deleted successfully',
    });
  }

  @Post(':id/concierge/messages')
  async sendMessage(@Param('id') id: string, @Body() req: SendMessageDto) {
    const result = await this.service.sendMessages(id, req);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Send concierge message successfully',
    });
  }

  @Post(':id/concierge/messages/:messageId/feedback')
  async sendFeedback(
    @Param('messageId') messageId: string,
    @Body() req: CreateFeedbackDto,
  ) {
    req.message_id = messageId;
    const result = await this.service.sendFeedback(req);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Send concierge message feedback successfully',
    });
  }
}
