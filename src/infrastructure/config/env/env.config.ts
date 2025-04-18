import { ConfigModuleOptions } from '@nestjs/config';
import { envSchema } from './env.schema';
import { mongodbConfig } from './mongodb.env';

export const envConfig: ConfigModuleOptions = {
  load: [mongodbConfig],
  validationSchema: envSchema,
  isGlobal: true,
};
