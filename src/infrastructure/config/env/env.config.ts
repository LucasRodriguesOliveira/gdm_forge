import { ConfigModuleOptions } from '@nestjs/config';
import { envSchema } from './env.schema';
import { mongodbConfig } from './mongodb.env';
import { rmqConfig } from './rmq.config';

export const envConfig: ConfigModuleOptions = {
  load: [mongodbConfig, rmqConfig],
  validationSchema: envSchema,
  isGlobal: true,
};
