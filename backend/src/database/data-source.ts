import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Attendee } from '../modules/attendee/attendee.entity';
import { Event } from '../modules/event/event.entity';
import { ToolCall } from '../modules/concierge/tool.entity';
import { Message } from '../modules/concierge/message.entity';
import { Feedback } from '../modules/feedback/feedback.entity';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Attendee, Event, ToolCall, Message, Feedback],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
