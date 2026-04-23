import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private client: GoogleGenAI;

  constructor(private config: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.config.get('GEMINI_API_KEY'),
    });
  }

  async generateWithTools(messages: any[], tools: any[]) {
    console.log('Messages: ', messages);
    return await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: messages,
      config: {
        tools,
      },
    });
  }

  async generateContent(prompt: string) {
    return this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
  }
}
