import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto, EventFilter, SendMessageDto } from './dto/event.dto';
import { MessageService } from '../concierge/message.service';
import { MessageRole } from '../concierge/message.entity';
import { AiService } from '../ai/ai.service';
import { tools } from '../ai/tools';
import { ToolCallService } from '../concierge/tool.service';
import { Part } from '@google/genai';
import { PinoLogger } from 'nestjs-pino';
import { FeedbackService } from '../feedback/feedback.service';
import { CreateFeedbackDto } from '../feedback/dto/feedback.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
    private messageService: MessageService,
    private aiService: AiService,
    private toolCallService: ToolCallService,
    private feedbackService: FeedbackService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EventService.name);
  }

  log(action: string, args: Record<string, any>, message: string) {
    this.logger.info({ action, ...args }, message ?? '');
  }

  create(dto: CreateEventDto) {
    const event = this.repo.create(dto);
    return this.repo.save(event);
  }

  async findAll(filter: EventFilter) {
    const query = this.repo.createQueryBuilder('event');

    if (filter.search) {
      query.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.location) LIKE LOWER(:search)',
        { search: `%${filter.search}%` },
      );
    }

    query.orderBy(`event.${filter.sort_by}`, filter.sort_order);

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  findById(id: string) {
    return this.repo.findOneBy({ id: id });
  }

  update(id: string, req: Partial<Event>) {
    return this.repo.update(id, req);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  validateToolCall(name: string, args: any) {
    const allowedTools = [
      'search_attendees',
      'score_match',
      'draft_intro_message',
    ];

    if (!allowedTools.includes(name)) {
      this.logger.info({ action: 'validate_tool' }, 'Invalid Tool');
      return false;
    }

    if (typeof args !== 'object') {
      this.logger.info(
        { action: 'validate_tool' },
        'Invalid Tool: Invalid arguments',
      );
      return false;
    }

    return true;
  }

  async sendMessages(eventId: string, req: SendMessageDto) {
    this.log(
      'send_message',
      { eventId, attendeeId: req.attendee_id },
      'Sending message to AI',
    );

    const resMessage = await this.messageService.create({
      event_id: eventId,
      attendee_id: req.attendee_id,
      role: MessageRole.USER,
      content: {
        text: req.message,
      },
    });

    const history = await this.messageService.findAllByEventAndAttendee(
      eventId,
      req.attendee_id,
    );

    let messages = history.map((m) => ({
      role: m.role,
      parts: [m.content],
    }));

    let usedTools: string[] = [];
    let matches: any[] = [];
    let finalText = '';

    try {
      for (let i = 0; i < 4; i++) {
        this.log(
          'get_tool',
          {
            eventId,
            attendeeId: req.attendee_id,
            messageCount: messages?.length,
          },
          'Generate with tool',
        );

        const resp = await this.aiService.generateWithTools(messages, tools);
        const candidate = resp.candidates?.[0];

        if (candidate?.finishReason === 'SAFETY') {
          this.logger.warn('Gemini response blocked by safety filters');
          finalText =
            "I'm sorry, I cannot process this request due to safety filters. Please try rephrasing your message.";
          break;
        }

        const content = candidate?.content;

        const functionCallPart = content?.parts?.find(
          (p: Part) => p?.functionCall,
        );
        if (!functionCallPart) {
          finalText = resp?.text ?? '';
          break;
        }

        const functionCall = functionCallPart.functionCall;
        const validateTool = this.validateToolCall(
          functionCall?.name ?? '',
          functionCall?.args ?? {},
        );
        if (!validateTool) {
          this.logger.warn({ functionCall }, 'Tool validation failed');
          continue;
        }

        if (functionCall?.name) {
          usedTools = [...usedTools, functionCall?.name];
        }

        this.logger.debug(
          { tool: functionCall?.name, args: functionCall?.args },
          'Executing tool',
        );

        const resExecute: any = await this.toolCallService.executeTool(
          functionCall?.name ?? '',
          functionCall?.args,
          eventId,
          req.attendee_id,
        );
        if (!resExecute || resExecute?.data?.length === 0) {
          break;
        }

        await this.toolCallService.create({
          message_id: resMessage?.id,
          tool_name: functionCall?.name ?? '',
          input: functionCall?.args,
          output: resExecute?.data,
        });

        if (functionCall?.name === 'search_attendees') {
          matches = resExecute?.data ?? [];
        }

        messages = [
          ...messages,
          {
            role: MessageRole.ASSISTANT,
            parts: [
              {
                functionResponse: {
                  name: functionCall?.name,
                  response: {
                    result: resExecute?.data ?? null,
                    error: resExecute?.error ?? false,
                  },
                },
              },
            ],
          },
        ];
      }
    } catch (error) {
      this.logger.error({ error }, 'Critical error in sendMessages AI loop');
      finalText =
        finalText ||
        "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
    }

    // Save AI response to history if we have one
    if (finalText) {
      await this.messageService.create({
        event_id: eventId,
        attendee_id: req.attendee_id,
        role: MessageRole.ASSISTANT,
        content: {
          text: finalText,
        },
      });
    }

    return {
      reply: finalText,
      matches: matches.map(({ embedding, ...rest }) => rest),
      meta: {
        used_tools: usedTools,
        total_matches: matches.length,
      },
    };
  }

  async sendFeedback(req: CreateFeedbackDto) {
    return this.feedbackService.create(req);
  }
}
