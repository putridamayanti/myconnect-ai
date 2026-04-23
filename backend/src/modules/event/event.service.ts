import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto, SendMessageDto } from './dto/event.dto';
import { MessageService } from '../concierge/message.service';
import { MessageRole } from '../concierge/message.entity';
import { AiService } from '../ai/ai.service';
import { tools } from '../ai/tools';
import { ToolCallService } from '../concierge/tool.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
    private messageService: MessageService,
    private aiService: AiService,
    private toolCallService: ToolCallService,
  ) {}

  create(dto: CreateEventDto) {
    const event = this.repo.create(dto);
    return this.repo.save(event);
  }

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOneBy({ id: id });
  }

  update(id: string, req: any) {
    return this.repo.update(id, req);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async sendMessage(id: string, req: SendMessageDto) {
    const resMessage = await this.messageService.create({
      event_id: id,
      attendee_id: req.attendee_id,
      role: MessageRole.USER,
      content: {
        text: req.message,
      },
    });

    const history = await this.messageService.findAllByEventAndAttendee(
      id,
      req.attendee_id,
    );

    const messages = history.map((m) => ({
      role: m.role,
      parts: [m.content],
    }));

    const resp = await this.aiService.generateWithTools(messages, tools);
    const candidate = resp.candidates?.[0];
    const content = candidate?.content;

    let usedTools: string[] = [];

    const functionCallPart = content?.parts?.find((p: any) => p?.functionCall);
    if (!functionCallPart) {
      return null;
    }

    const functionCall = functionCallPart.functionCall;
    if (functionCall?.name) {
      usedTools = [...usedTools, functionCall?.name];
    }

    const resExecute: any = await this.toolCallService.executeTool(
      functionCall?.name ?? '',
      functionCall?.args,
      id,
      req.attendee_id,
    );
    if (!resExecute || resExecute?.data?.length === 0) {
      return null;
    }

    await this.toolCallService.create({
      message_id: resMessage?.id,
      tool_name: functionCall?.name ?? '',
      input: functionCall?.args,
      output: resExecute?.data,
    });

    const followUp = await this.aiService.generateWithTools(
      [
        ...messages,
        {
          role: 'model',
          parts: [
            {
              functionResponse: {
                name: functionCall?.name,
                response: {
                  result: resExecute?.data,
                },
              },
            },
          ],
        },
      ],
      tools,
    );

    const finalText = followUp.text;

    await this.messageService.create({
      event_id: id,
      attendee_id: req.attendee_id,
      role: MessageRole.ASSISTANT,
      content: { text: finalText, matches: resExecute?.data },
    });

    const matches: any[] = [];

    if (
      resExecute?.data?.length > 0 &&
      functionCall?.name !== 'draft_intro_message'
    ) {
      usedTools = [...usedTools, 'score_match'];
      for (const [index, item] of resExecute?.data?.entries()) {
        const candidate: any = item;
        const args = {
          sourceAttendeeId: req.attendee_id,
          attendeeId: candidate?.id,
        };
        const result: any =
          await this.toolCallService.executeTool('score_match', args, '', '');

        console.log('Candidate', candidate?.id, result);
        matches.push({
          id: item.id,
          name: item.name,
          headline: item.headline,
          bio: item.bio,
          company: item.company,
          role: item.role,
          looking_for: item.looking_for,
          open_to_chat: item.open_to_chat,
          score: result?.data?.score ?? 0,
          reason: result?.data?.reason ?? ''
        });
      }
    }

    return {
      reply: finalText,
      matches: matches,
      meta: {
        used_tools: usedTools,
        total_matches: matches.length,
      },
    };
  }
}
