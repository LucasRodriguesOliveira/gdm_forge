import { Test, TestingModule } from '@nestjs/testing';
import { NotifyUseCase } from './notify.usecase';
import { faker } from '@faker-js/faker';
import { IntegrationProgressPayload } from '../../../domain/service/integration-progress.payload';

describe('NotifyUseCase', () => {
  let notifyUseCase: NotifyUseCase;

  const queueContactService = {
    integrationProgress: jest.fn(),
  };

  const loggerService = {
    log: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NotifyUseCase,
          useFactory: () =>
            new NotifyUseCase(queueContactService, loggerService),
        },
      ],
    }).compile();

    notifyUseCase = module.get<NotifyUseCase>(NotifyUseCase);
  });

  it('should be defined', () => {
    expect(notifyUseCase).toBeDefined();
  });

  describe('integrationProgress', () => {
    const payload: IntegrationProgressPayload = {
      userId: faker.string.uuid(),
      progress: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    };

    it('should notify queue service without logging', () => {
      notifyUseCase.integrationProgress(payload);

      expect(queueContactService.integrationProgress).toHaveBeenCalledWith(
        payload,
      );
      expect(loggerService.log).not.toHaveBeenCalled();
    });

    it('should notify queue service and log if logOptions.should is true', () => {
      const logMessage = 'Progress notification sent.';

      notifyUseCase.integrationProgress(payload, {
        should: true,
        message: logMessage,
      });

      expect(queueContactService.integrationProgress).toHaveBeenCalledWith(
        payload,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        NotifyUseCase.name,
        logMessage,
      );
    });
  });
});
