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

@Controller('contact')
@UseInterceptors(new PresenterInterceptor(ContactResult, { entity: 'contact' }))
export class ContactController {
  constructor(
    @Inject(CreateContactProxy.Token)
    private readonly createContactUseCase: CreateContactUseCase,
    @Inject(FindContactByIdProxy.Token)
    private readonly findContactByIdUseCase: FindContactByIdUseCase,
    @Inject(ListContactProxy.Token)
    private readonly listContactUseCase: ListContactUseCase,
  ) {}

  @GrpcMethod(GRPCService.CONTACT)
  public async create(
    createContactDto: CreateContactDto,
  ): Promise<Result<Contact, ErrorResponse>> {
    return this.createContactUseCase.run(createContactDto);
  }

  @GrpcMethod(GRPCService.CONTACT)
  public async findById({
    id,
  }: FindContactById): Promise<Result<Contact, ErrorResponse>> {
    return this.findContactByIdUseCase.run(id);
  }

  @GrpcMethod(GRPCService.CONTACT)
  public async list(
    queryContact: QueryContactOptions,
  ): Promise<Result<Contact[], ErrorResponse>> {
    return this.listContactUseCase.run(queryContact);
  }

  @GrpcStreamMethod(GRPCService.CONTACT)
  public bulkCreate(
    messages: Observable<CreateContactDto>,
  ): Observable<Result<Contact, ErrorResponse>> {
    const subject = new Subject<Result<Contact, ErrorResponse>>();

    const onNext = async (message: CreateContactDto) => {
      const result = await this.createContactUseCase.run(message);

      subject.next(result);
    };

    const onComplete = () => subject.complete();

    messages.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
