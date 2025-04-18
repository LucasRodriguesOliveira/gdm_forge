import { Provider } from '@nestjs/common';
import { CreateContactUseCase } from 'src/application/usecase/contact/create-contact.usecase';
import { ILoggerService } from 'src/domain/logger/logger.interface';
import { IContactRepository } from 'src/domain/repository/contact-repository.interface';
import { ContactRepository } from 'src/infrastructure/repository/contact.repository';
import { Proxy } from '../..';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

const token = Symbol('__CREATE_CONTACT_USE_CASE__');
const provider: Provider = {
  provide: token,
  useFactory: (repository: IContactRepository, logger: ILoggerService) =>
    new CreateContactUseCase(repository, logger),
  inject: [ContactRepository, LoggerService],
};

export const CreateContactProxy = new Proxy(token, provider);
