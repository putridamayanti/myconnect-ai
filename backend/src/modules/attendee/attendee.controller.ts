import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeFilter, CreateAttendeeDto } from './dto/attendee.dto';
import { ResponseDto } from '../../common/dto/response.dto';

@Controller('attendees')
export class AttendeeController {
  constructor(private readonly service: AttendeeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateAttendeeDto): Promise<ResponseDto> {
    const result = await this.service.create(dto);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Attendee created successfully',
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() filter: AttendeeFilter) {
    const result = await this.service.findAll(filter);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Attendees fetched successfully',
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.service.findById(id);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Attendee fetched successfully',
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() req: any) {
    const result = await this.service.update(id, req);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Attendee updated successfully',
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    return new ResponseDto({
      status_code: 200,
      data: result,
      message: 'Attendee deleted successfully',
    });
  }
}
