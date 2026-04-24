import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './modules/event/event.module';
import { ConfigModule } from '@nestjs/config';
import { ConciergeModule } from './modules/concierge/concierge.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AttendeeModule } from './modules/attendee/attendee.module';
import { AiModule } from './modules/ai/ai.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EventModule,
    AttendeeModule,
    ConciergeModule,
    FeedbackModule,
    AiModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
