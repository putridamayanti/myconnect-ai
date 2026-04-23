import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tool_calls')
export class ToolCall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message_id: string;

  @Column()
  tool_name: string;

  @Column({ type: 'jsonb' })
  input: any;

  @Column({ type: 'jsonb', nullable: true })
  output: any;

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
}
