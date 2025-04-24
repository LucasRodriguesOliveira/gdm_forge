import { ILoggerService } from '../../../domain/logger/logger.interface';
import { IntegrationProgressPayload } from '../../../domain/service/integration-progress.payload';
import { IQueueContactService } from '../../../domain/service/queue-contact-service.interface';

interface NotifyLogOptions {
  should: boolean;
  message: string;
}

export class NotifyUseCase {
  constructor(
    private readonly queueContactService: IQueueContactService,
    private readonly loggerService: ILoggerService,
  ) {}

  integrationProgress(
    payload: IntegrationProgressPayload,
    logOptions?: NotifyLogOptions,
  ): void {
    this.queueContactService.integrationProgress(payload);

    if (logOptions?.should) {
      this.loggerService.log(NotifyUseCase.name, logOptions.message);
    }
  }
}
