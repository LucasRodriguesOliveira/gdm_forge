import { Provider } from '@nestjs/common';
import { Proxy } from '../..';
import { IContactRepository } from '../../../../domain/repository/contact-repository.interface';
import { ILoggerService } from '../../../../domain/logger/logger.interface';
import { FindContactByIdUseCase } from '../../../../application/usecase/contact/find-contact-by-id.usecase';
import { ContactRepository } from '../../../repository/contact.repository';
import { LoggerService } from '../../../logger/logger.service';

const token = Symbol('__FIND_CONTACT_BY_ID_USE_CASE__');
const provider: Provider = {
  provide: token,
  useFactory: (repository: IContactRepository, logger: ILoggerService) =>
    new FindContactByIdUseCase(repository, logger),
  inject: [ContactRepository, LoggerService],
};

export const FindContactByIdProxy = new Proxy(token, provider);
