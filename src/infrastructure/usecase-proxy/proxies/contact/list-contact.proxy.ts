import { Provider } from '@nestjs/common';
import { ListContactUseCase } from 'src/application/usecase/contact/list-contact.usecase';
import { ILoggerService } from 'src/domain/logger/logger.interface';
import { IContactRepository } from 'src/domain/repository/contact-repository.interface';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ContactRepository } from 'src/infrastructure/repository/contact.repository';
import { Proxy } from '../..';

const token = Symbol('__LIST_CONTACT_USE_CASE__');
const provider: Provider = {
  provide: token,
  useFactory: (repository: IContactRepository, logger: ILoggerService) =>
    new ListContactUseCase(repository, logger),
  inject: [ContactRepository, LoggerService],
};

export const ListContactProxy = new Proxy(token, provider);
