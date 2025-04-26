import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqContactService } from './rabbitmq-contact.service';
import { ClientRMQ } from '@nestjs/microservices';
import { rmqContactClientToken } from '../../config/rabbitmq/rabbitmq-contact.config';
import { Observable } from 'rxjs';
import { IntegrationProgressPayload } from '../../../domain/service/integration-progress.payload';
import { faker } from '@faker-js/faker';
import { RmqContactPattern } from './rabbitmq-contact-pattern.enum';

const clientRMQMock = {
  connect: jest.fn(),
  emit: jest.fn(),
};

describe('RabbitmqContactService', () => {
  let rabbitmqContactService: RabbitmqContactService;
  let clientRMQ: jest.Mocked<ClientRMQ>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqContactService,
        {
          provide: rmqContactClientToken.description!,
          useValue: clientRMQMock,
        },
      ],
    }).compile();

    rabbitmqContactService = app.get<RabbitmqContactService>(
      RabbitmqContactService,
    );
    clientRMQ = app.get(rmqContactClientToken.description!);
  });

  it('should be defined', () => {
    expect(clientRMQ).toBeDefined();
    expect(rabbitmqContactService).toBeDefined();
  });

  describe('bootstrap', () => {
    beforeEach(() => {
      clientRMQ.connect.mockResolvedValueOnce({});
    });

    it('should connect to rmq server on application bootstrap', async () => {
      await rabbitmqContactService.onApplicationBootstrap();

      expect(clientRMQ.connect).toHaveBeenCalled();
    });
  });

  describe('integrationProgress', () => {
    const integrationPayload: IntegrationProgressPayload = {
      progress: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      userId: faker.string.uuid(),
    };

    beforeEach(() => {
      clientRMQ.emit.mockReturnValueOnce(new Observable());
    });

    it('should emit a message to rmw server', () => {
      rabbitmqContactService.integrationProgress(integrationPayload);

      expect(clientRMQ.emit).toHaveBeenCalledWith<
        [RmqContactPattern, IntegrationProgressPayload]
      >(RmqContactPattern.INTEGRATION_PROCESSING, integrationPayload);
    });
  });
});
