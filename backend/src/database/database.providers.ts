import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: (configService: ConfigService) => {
      return configService.get('DATABASE_URL');
    },
    inject: [ConfigService],
  },
];
