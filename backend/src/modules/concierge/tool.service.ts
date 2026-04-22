import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToolLog } from './tool.entity';
import { Repository } from 'typeorm';
import { CreateToolLogDto } from './dto/tool.dto';

@Injectable()
export class ToolLogService {
  constructor(
    @InjectRepository(ToolLog)
    private repo: Repository<ToolLog>
  ) {}

  create(req: CreateToolLogDto) {
    const log = this.repo.create(req)
    return this.repo.save(log)
  }
}