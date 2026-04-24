import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor, Query,
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeFilter, CreateAttendeeDto } from './dto/attendee.dto';
import { Attendee } from './attendee.entity';
import { ResponseDto } from '../../common/dto/response.dto';

@Controller('attendees')
export class AttendeeController {
  constructor(private readonly service: AttendeeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() dto: CreateAttendeeDto): Promise<Attendee> {
    return this.service.create(dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() filter: AttendeeFilter) {
    const result = await this.service.findAll(filter);
    const response = {
      status_code: 200,
      data: result,
      message: 'Attendees fetched successfully',
    };
    return new ResponseDto(response);
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
}
