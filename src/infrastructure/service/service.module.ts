import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { clientConfig } from '../config/clients/clients.config';
import { RabbitmqContactService } from './rabbitmq/rabbitmq-contact.service';

@Module({
  imports: [ClientsModule.registerAsync(clientConfig)],
  providers: [RabbitmqContactService],
  exports: [RabbitmqContactService],
})
export class ServiceModule {}
