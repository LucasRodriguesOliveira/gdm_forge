import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { RmqContactPattern } from './rabbitmq-contact-pattern.enum';
import { IQueueContactService } from '../../../domain/service/queue-contact-service.interface';
import { IntegrationProgressPayload } from '../../../domain/service/integration-progress.payload';
import { rmqContactClientToken } from '../../config/rabbitmq/rabbitmq-contact.config';

@Injectable()
export class RabbitmqContactService
  implements OnApplicationBootstrap, IQueueContactService
{
  constructor(
    @Inject(rmqContactClientToken.description!)
    private readonly client: ClientRMQ,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  integrationProgress(payload: IntegrationProgressPayload): void {
    this.client.emit<string, IntegrationProgressPayload>(
      RmqContactPattern.INTEGRATION_PROCESSING,
      payload,
    );
  }
}
