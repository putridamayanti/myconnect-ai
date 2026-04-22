import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: (configService: ConfigService) => {
      console.log('Config', configService)
      return configService.get('DATABASE_URL');
    },
    inject: [ConfigService],
  },
];
