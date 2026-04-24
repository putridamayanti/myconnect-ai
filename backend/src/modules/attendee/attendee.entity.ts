import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Event } from '../event/event.entity';

@Entity('attendees')
export class Attendee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: true })
  event_id: string;

  @Column()
  name: string;

  @Column()
  headline: string;

  @Column({ type: 'text' })
  bio: string;

  @Column()
  company: string;

  @Column()
  role: string;

  @Column('text', { array: true })
  skills: string[];

  @Column({ type: 'text' })
  looking_for: string;

  @Index()
  @Column({ default: true })
  open_to_chat: boolean;

  @Exclude()
  @Column({ type: 'vector', nullable: true })
  embedding: number[];

  @Index()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.attendees, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
