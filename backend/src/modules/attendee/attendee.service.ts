import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendeeDto } from './dto/attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private repo: Repository<Attendee>,
  ) {}

  create(dto: CreateAttendeeDto) {
    const attendee = this.repo.create(dto);
    return this.repo.save(attendee);
  }


  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOneBy({id: id})
  }

  update(id: string, req: any) {
    return this.repo.update(id, req)
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}