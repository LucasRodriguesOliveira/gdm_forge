import { ConfigService } from '@nestjs/config';
import { MongodbConfig } from 'src/infrastructure/config/types/mongodb.interface';
import { MONGODB_TOKEN } from 'src/infrastructure/config/env/mongodb.env';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseOptions: MongooseModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    const { url, password, user, database } =
      configService.getOrThrow<MongodbConfig>(MONGODB_TOKEN.description!);
    return {
      uri: url,
      user,
      pass: password,
      authSource: 'admin',
      dbName: database,
    };
  },
  inject: [ConfigService],
};
