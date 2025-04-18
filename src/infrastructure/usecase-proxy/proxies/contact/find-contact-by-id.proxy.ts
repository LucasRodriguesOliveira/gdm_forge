import { Provider } from '@nestjs/common';
import { FindContactByIdUseCase } from 'src/application/usecase/contact/find-contact-by-id.usecase';
import { ILoggerService } from 'src/domain/logger/logger.interface';
import { IContactRepository } from 'src/domain/repository/contact-repository.interface';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ContactRepository } from 'src/infrastructure/repository/contact.repository';
import { Proxy } from '../..';

const token = Symbol('__FIND_CONTACT_BY_ID_USE_CASE__');
const provider: Provider = {
  provide: token,
  useFactory: (repository: IContactRepository, logger: ILoggerService) =>
    new FindContactByIdUseCase(repository, logger),
  inject: [ContactRepository, LoggerService],
};

export const FindContactByIdProxy = new Proxy(token, provider);
