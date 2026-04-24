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
import { FeedbackService } from './feedback.service';
import {
  CreateFeedbackDto,
  FeedbackFilter,
  UpdateFeedbackDto,
} from './dto/feedback.dto';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() filter: FeedbackFilter) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() req: UpdateFeedbackDto) {
    return this.service.update(id, req);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
