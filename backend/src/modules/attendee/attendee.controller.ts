import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/attendee.dto';

@Controller('attendees')
export class AttendeeController {
  constructor(private readonly service: AttendeeService) {}

  @Post()
  create(@Body() dto: CreateAttendeeDto) {
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
}