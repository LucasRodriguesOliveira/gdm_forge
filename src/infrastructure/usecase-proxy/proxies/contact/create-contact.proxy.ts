import { Provider } from '@nestjs/common';
import { Proxy } from '../..';
import { IContactRepository } from '../../../../domain/repository/contact-repository.interface';
import { ILoggerService } from '../../../../domain/logger/logger.interface';
import { CreateContactUseCase } from '../../../../application/usecase/contact/create-contact.usecase';
import { ContactRepository } from '../../../repository/contact.repository';
import { LoggerService } from '../../../logger/logger.service';

const token = Symbol('__CREATE_CONTACT_USE_CASE__');
const provider: Provider = {
  provide: token,
  useFactory: (repository: IContactRepository, logger: ILoggerService) =>
    new CreateContactUseCase(repository, logger),
  inject: [ContactRepository, LoggerService],
};

export const CreateContactProxy = new Proxy(token, provider);
