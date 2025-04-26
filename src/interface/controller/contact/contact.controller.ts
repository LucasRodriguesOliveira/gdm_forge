import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { ContactResult } from './presenter/contact.result';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindContactById } from './dto/find-contact-by-id.dto';
import { Observable, ReplaySubject } from 'rxjs';
import { PaginatedContact } from '../../../domain/repository/paginated-contact.result';
import { NotifyProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/notify.proxy';
import { User } from '../../../domain/model/user.model';
import { CreateContactUseCase } from '../../../application/usecase/contact/create-contact.usecase';
import { FindContactByIdUseCase } from '../../../application/usecase/contact/find-contact-by-id.usecase';
import { ListContactUseCase } from '../../../application/usecase/contact/list-contact.usecase';
import { NotifyUseCase } from '../../../application/usecase/contact/notify.usecase';
import { CreateContactProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/create-contact.proxy';
import { FindContactByIdProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/find-contact-by-id.proxy';
import { ListContactProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/list-contact.proxy';
import { GRPCService } from '../../../infrastructure/grpc/service.enum';
import { PresenterInterceptor } from '../../../infrastructure/common/interceptor/presenter.interceptor';
import { ContactModel } from '../../../domain/model/contact.model';
import { ErrorResponse } from '../../../domain/types/error.interface';
import { Result } from '../../../domain/types/result';
import { QueryContactOptions } from '../../../domain/repository/contact-repository.interface';

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
  ): Promise<Result<ContactModel, ErrorResponse>> {
    return this.createContactUseCase.run(createContactDto);
  }

  @GrpcMethod(GRPCService.CONTACT)
  @UseInterceptors(
    new PresenterInterceptor(ContactResult, { entity: 'contact' }),
  )
  public async findById({
    id,
    userId,
  }: FindContactById): Promise<Result<ContactModel, ErrorResponse>> {
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
  ): Observable<Result<ContactModel, ErrorResponse>> {
    const subject = new ReplaySubject<Result<ContactModel, ErrorResponse>>();

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
