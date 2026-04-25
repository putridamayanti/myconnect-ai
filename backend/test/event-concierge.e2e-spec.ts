import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { EventController } from '../src/modules/event/event.controller';
import { EventService } from '../src/modules/event/event.service';
import { MessageService } from '../src/modules/concierge/message.service';
import { AiService } from '../src/modules/ai/ai.service';
import { ToolCallService } from '../src/modules/concierge/tool.service';
import { AttendeeService } from '../src/modules/attendee/attendee.service';
import { EmbeddingService } from '../src/modules/ai/embedding.service';
import { FeedbackService } from '../src/modules/feedback/feedback.service';

import { Event } from '../src/modules/event/event.entity';
import { Attendee } from '../src/modules/attendee/attendee.entity';
import { Message } from '../src/modules/concierge/message.entity';
import { ToolCall } from '../src/modules/concierge/tool.entity';
import { Feedback } from '../src/modules/feedback/feedback.entity';

describe('Event Concierge (e2e)', () => {
  let app: INestApplication;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((entity) => Promise.resolve({ id: 'uuid', ...entity })),
    find: jest.fn().mockResolvedValue([]),
    findOneBy: jest.fn().mockResolvedValue({ id: 'uuid', name: 'Test' }),
    delete: jest.fn().mockResolvedValue({}),
    createQueryBuilder: jest.fn().mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    }),
    findAllByEventAndAttendee: jest.fn().mockResolvedValue([]),
  };

  const mockDataSource = {
    query: jest.fn().mockResolvedValue({ data: [] }),
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      release: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    }),
  };

  const mockAiService = {
    generateWithTools: jest.fn().mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [{ text: 'I found some interesting people for you!' }],
          },
        },
      ],
      text: 'I found some interesting people for you!',
    }),
    generateContent: jest.fn().mockResolvedValue({
      text: 'Mocked content',
    }),
  };

  const mockEmbeddingService = {
    geminiEmbed: jest.fn().mockResolvedValue(new Array(768).fill(0)),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule.forRoot({
          pinoHttp: { level: 'silent' },
        }),
      ],
      controllers: [EventController],
      providers: [
        EventService,
        MessageService,
        AiService,
        ToolCallService,
        AttendeeService,
        EmbeddingService,
        FeedbackService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Attendee),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ToolCall),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Feedback),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    })
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .overrideProvider(EmbeddingService)
      .useValue(mockEmbeddingService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should send a message to the AI concierge and get a reply (POST /events/:id/concierge/messages)', async () => {
    const eventId = 'test-event-id';
    const attendeeId = 'test-attendee-id';

    const response = await request(app.getHttpServer())
      .post(`/events/${eventId}/concierge/messages`)
      .send({
        attendee_id: attendeeId,
        message: 'Who should I talk to about AI?',
      })
      .expect(201);

    expect(response.body).toHaveProperty('reply');
    expect(response.body.reply).toBe('I found some interesting people for you!');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('used_tools');
    expect(Array.isArray(response.body.meta.used_tools)).toBe(true);
  });
});
