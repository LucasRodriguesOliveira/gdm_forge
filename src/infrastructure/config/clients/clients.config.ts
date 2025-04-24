import { ClientsModuleAsyncOptions } from '@nestjs/microservices';
import { rmqContactClientProvider } from '../rabbitmq/rabbitmq-contact.config';

export const clientConfig: ClientsModuleAsyncOptions = {
  clients: [rmqContactClientProvider],
};
