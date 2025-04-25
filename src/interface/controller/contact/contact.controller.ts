import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { CreateContactUseCase } from 'src/application/usecase/contact/create-contact.usecase';
import { PresenterInterceptor } from 'src/infrastructure/common/interceptor/presenter.interceptor';
import { CreateContactProxy } from 'src/infrastructure/usecase-proxy/proxies/contact/create-contact.proxy';
import { ContactResult } from './presenter/contact.result';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { GRPCService } from 'src/infrastructure/grpc/service.enum';
import { CreateContactDto } from './dto/create-contact.dto';
import { Result } from 'src/domain/types/result';
import { Contact } from 'src/domain/model/contact.model';
import { ErrorResponse } from 'src/domain/types/error.interface';
import { FindContactById } from './dto/find-contact-by-id.dto';
import { FindContactByIdProxy } from 'src/infrastructure/usecase-proxy/proxies/contact/find-contact-by-id.proxy';
import { FindContactByIdUseCase } from 'src/application/usecase/contact/find-contact-by-id.usecase';
import { ListContactProxy } from 'src/infrastructure/usecase-proxy/proxies/contact/list-contact.proxy';
import { ListContactUseCase } from 'src/application/usecase/contact/list-contact.usecase';
import { QueryContactOptions } from 'src/domain/repository/contact-repository.interface';
import { Observable, Subject } from 'rxjs';
import { PaginatedContact } from '../../../domain/repository/paginated-contact.result';
import { NotifyProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/notify.proxy';
import { NotifyUseCase } from '../../../application/usecase/contact/notify.usecase';
import { User } from '../../../domain/model/user.model';

@Controller('contact')
export class ContactController {
  constructor(
    @Inject(CreateContactProxy.Token)
    private readonly createContactUseCase: CreateContactUseCase,
    @Inject(FindContactByIdProxy.Token)
    private readonly findContactByIdUseCase: FindContactByIdUseCase,
    @Inject(ListContactProxy.Token)
    private readonly listContactUseCase: ListContactUseCase,
    @Inject(NotifyProxy.Token)
    private readonly notifyUseCase: NotifyUseCase,
  ) {}

  @GrpcMethod(GRPCService.CONTACT)
  @UseInterceptors(
    new PresenterInterceptor(ContactResult, { entity: 'contact' }),
  )
  public async create(
    createContactDto: CreateContactDto,
  ): Promise<Result<Contact, ErrorResponse>> {
    return this.createContactUseCase.run(createContactDto);
  }

  @GrpcMethod(GRPCService.CONTACT)
  @UseInterceptors(
    new PresenterInterceptor(ContactResult, { entity: 'contact' }),
  )
  public async findById({
    id,
    userId,
  }: FindContactById): Promise<Result<Contact, ErrorResponse>> {
    return this.findContactByIdUseCase.run(id, userId);
  }

  @GrpcMethod(GRPCService.CONTACT)
  @UseInterceptors(
    new PresenterInterceptor(
      ContactResult,
      { entity: 'contact', array: 'items' },
      { paginated: true },
    ),
  )
  public async list(
    queryContact: QueryContactOptions,
  ): Promise<Result<PaginatedContact, ErrorResponse>> {
    return this.listContactUseCase.run(queryContact);
  }

  @GrpcStreamMethod(GRPCService.CONTACT)
  @UseInterceptors(
    new PresenterInterceptor(ContactResult, { entity: 'contact' }),
  )
  public bulkCreate(
    messages: Observable<CreateContactDto>,
  ): Observable<Result<Contact, ErrorResponse>> {
    const subject = new Subject<Result<Contact, ErrorResponse>>();

    let userId: User['id'];
    const onNext = async (message: CreateContactDto) => {
      const result = await this.createContactUseCase.run(message);

      if (!userId) {
        userId = message.userId;
      }

      subject.next(result);
    };

    const onComplete = () => {
      this.notifyUseCase.integrationProgress(
        { progress: 1, userId },
        { message: 'Integration completed', should: true },
      );
      return subject.complete();
    };

    messages.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
