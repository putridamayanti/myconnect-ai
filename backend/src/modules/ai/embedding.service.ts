import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class EmbeddingService {
  private client: OpenAI;
  private geminiClient: GoogleGenerativeAI;
  private geminiModel: any;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });

    this.geminiClient = new GoogleGenerativeAI(
      <string>this.config.get('GEMINI_API_KEY'),
    );

    this.geminiModel = this.geminiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async embed(text: string) {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  }

  async geminiEmbed(text: string) {
    try {
      const model = this.geminiClient.getGenerativeModel({
        model: 'gemini-embedding-2',
      });

      const response = await model.embedContent(text);

      if (!response.embedding) {
        throw new Error('Failed to generate embedding');
      }

      return response.embedding.values;
    } catch (error) {
      throw error;
    }
  }
}
