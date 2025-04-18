import { Provider } from '@nestjs/common';
import { mongooseToken } from './mongoose.token';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MongodbConfig } from 'src/infrastructure/config/types/mongodb.interface';
import { MONGODB_TOKEN } from 'src/infrastructure/config/env/mongodb.env';

export const mongooseProvider: Provider = {
  provide: mongooseToken,
  useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
    mongoose.connect(
      configService.getOrThrow<MongodbConfig>(MONGODB_TOKEN.description!).url,
    ),
  inject: [ConfigService],
};
