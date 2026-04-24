import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeService } from './attendee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { DataSource, Repository } from 'typeorm';
import { EmbeddingService } from '../ai/embedding.service';

describe('AttendeeService', () => {
  let service: AttendeeService;
  let repo: Repository<Attendee>;
  let dataSource: DataSource;
  let embeddingService: EmbeddingService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = {
    query: jest.fn(),
  };

  const mockEmbeddingService = {
    geminiEmbed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendeeService,
        {
          provide: getRepositoryToken(Attendee),
          useValue: mockRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: EmbeddingService,
          useValue: mockEmbeddingService,
        },
      ],
    }).compile();

    service = module.get<AttendeeService>(AttendeeService);
    repo = module.get<Repository<Attendee>>(getRepositoryToken(Attendee));
    dataSource = module.get<DataSource>(DataSource);
    embeddingService = module.get<EmbeddingService>(EmbeddingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should return search results based on embedding similarity', async () => {
      const eventId = 'test-event-id';
      const query = 'developer interested in AI';
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockSearchResults = [
        { id: '1', name: 'John Doe', distance: 0.1 },
        { id: '2', name: 'Jane Smith', distance: 0.2 },
      ];

      mockEmbeddingService.geminiEmbed.mockResolvedValue(mockEmbedding);
      mockDataSource.query.mockResolvedValue(mockSearchResults);

      const result = await service.search(eventId, query);

      expect(embeddingService.geminiEmbed).toHaveBeenCalledWith(query);
      expect(dataSource.query).toHaveBeenCalled();
      
      // Verify the query arguments
      const lastCallArgs = (dataSource.query as jest.Mock).mock.calls[0];
      const expectedVector = `[${mockEmbedding.join(',')}]`;
      expect(lastCallArgs[1]).toEqual([expectedVector, eventId]);
      
      expect(result).toEqual({ data: mockSearchResults });
    });

    it('should handle empty results', async () => {
      const eventId = 'empty-event';
      const query = 'something';
      
      mockEmbeddingService.geminiEmbed.mockResolvedValue([0, 0, 0]);
      mockDataSource.query.mockResolvedValue([]);

      const result = await service.search(eventId, query);

      expect(result).toEqual({ data: [] });
    });
  });
});
