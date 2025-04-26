import { Test, TestingModule } from '@nestjs/testing';
import { CreateContactUseCase } from '../../../application/usecase/contact/create-contact.usecase';
import { FindContactByIdUseCase } from '../../../application/usecase/contact/find-contact-by-id.usecase';
import { ListContactUseCase } from '../../../application/usecase/contact/list-contact.usecase';
import { NotifyUseCase } from '../../../application/usecase/contact/notify.usecase';
import { ContactController } from './contact.controller';
import { CreateContactProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/create-contact.proxy';
import { FindContactByIdProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/find-contact-by-id.proxy';
import { ListContactProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/list-contact.proxy';
import { NotifyProxy } from '../../../infrastructure/usecase-proxy/proxies/contact/notify.proxy';
import { CreateContactDto } from './dto/create-contact.dto';
import { fakerPT_BR } from '@faker-js/faker/.';
import { Result } from '../../../domain/types/result';
import { ContactModel } from '../../../domain/model/contact.model';
import { ErrorResponse } from '../../../domain/types/error.interface';
import { FindContactById } from './dto/find-contact-by-id.dto';
import { QueryContactOptions } from '../../../domain/repository/contact-repository.interface';
import { PaginatedContact } from '../../../domain/repository/paginated-contact.result';
import { Observable, ReplaySubject } from 'rxjs';

const createContactUseCaseMock = {
  run: jest.fn(),
};

const findContactByIdUseCaseMock = {
  run: jest.fn(),
};

const listContactUseCaseMock = {
  run: jest.fn(),
};

const notifyUseCaseMock = {
  integrationProgress: jest.fn(),
};

// error scenarios have already been tested in the specific use cases
describe('ContactController', () => {
  let contactController: ContactController;
  let createContactUseCase: jest.Mocked<CreateContactUseCase>;
  let findContactByIdUseCase: jest.Mocked<FindContactByIdUseCase>;
  let listContactUseCase: jest.Mocked<ListContactUseCase>;
  let notifyUseCase: jest.Mocked<NotifyUseCase>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateContactProxy.Token,
          useValue: createContactUseCaseMock,
        },
        {
          provide: FindContactByIdProxy.Token,
          useValue: findContactByIdUseCaseMock,
        },
        {
          provide: ListContactProxy.Token,
          useValue: listContactUseCaseMock,
        },
        {
          provide: NotifyProxy.Token,
          useValue: notifyUseCaseMock,
        },
      ],
      controllers: [ContactController],
    }).compile();

    contactController = app.get<ContactController>(ContactController);
    createContactUseCase = app.get(CreateContactProxy.Token);
    findContactByIdUseCase = app.get(FindContactByIdProxy.Token);
    listContactUseCase = app.get(ListContactProxy.Token);
    notifyUseCase = app.get(NotifyProxy.Token);
  });

  it('should be defined', () => {
    expect(notifyUseCase).toBeDefined();
    expect(createContactUseCase).toBeDefined();
    expect(findContactByIdUseCase).toBeDefined();
    expect(listContactUseCase).toBeDefined();
    expect(contactController).toBeDefined();
  });

  describe('create', () => {
    const createContactDto: CreateContactDto = {
      oldid: fakerPT_BR.number.int({ min: 1 }),
      name: fakerPT_BR.person.fullName(),
      phone: fakerPT_BR.phone.number(),
      state: fakerPT_BR.location.state({ abbreviated: true }),
      userId: fakerPT_BR.string.uuid(),
    };

    const expected: Result<ContactModel, ErrorResponse> = {
      value: Object.assign(
        { _id: fakerPT_BR.database.mongodbObjectId() },
        createContactDto,
      ),
    };

    beforeAll(() => {
      createContactUseCase.run.mockResolvedValueOnce(expected);
    });

    it('should create a contact without error', async () => {
      const result = await contactController.create(createContactDto);

      expect(createContactUseCase.run).toHaveBeenCalledWith<[CreateContactDto]>(
        createContactDto,
      );
      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('value');
      expect(result?.value).toEqual(expected.value);
    });
  });

  describe('findById', () => {
    const findContactById: FindContactById = {
      id: fakerPT_BR.database.mongodbObjectId(),
      userId: fakerPT_BR.string.uuid(),
    };

    const expected: Result<ContactModel, ErrorResponse> = {
      value: {
        _id: fakerPT_BR.database.mongodbObjectId(),
        oldid: fakerPT_BR.number.int({ min: 1 }),
        name: fakerPT_BR.person.fullName(),
        phone: fakerPT_BR.phone.number(),
        state: fakerPT_BR.location.state({ abbreviated: true }),
        userId: fakerPT_BR.string.uuid(),
      },
    };

    beforeAll(() => {
      findContactByIdUseCase.run.mockResolvedValueOnce(expected);
    });

    it('shoud return contact without error', async () => {
      const result = await contactController.findById(findContactById);

      expect(findContactByIdUseCase.run).toHaveBeenCalledWith<[string, string]>(
        findContactById.id,
        findContactById.userId,
      );
      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('value');
      expect(result?.value).toEqual(expected.value);
    });
  });

  describe('list', () => {
    const queryContactOptions: QueryContactOptions = {
      page: fakerPT_BR.number.int({ min: 1, max: 10 }),
      pageSize: 10,
      userId: fakerPT_BR.string.uuid(),
    };

    const expected: Result<PaginatedContact, ErrorResponse> = {
      value: {
        page: queryContactOptions.page,
        pageSize: queryContactOptions.pageSize,
        total: 1,
        contacts: [
          {
            _id: fakerPT_BR.database.mongodbObjectId(),
            oldid: fakerPT_BR.number.int({ min: 0 }),
            name: fakerPT_BR.person.fullName(),
            phone: fakerPT_BR.phone.number(),
            state: fakerPT_BR.location.state({ abbreviated: true }),
            userId: fakerPT_BR.string.uuid(),
          },
        ],
      },
    };

    beforeAll(() => {
      listContactUseCase.run.mockResolvedValueOnce(expected);
    });

    it('should return a paginated list of contacts', async () => {
      const result = await contactController.list(queryContactOptions);

      expect(listContactUseCase.run).toHaveBeenCalledWith<
        [QueryContactOptions]
      >(queryContactOptions);
      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('value');
      expect(result?.value).toEqual(expected.value);
    });
  });

  describe('bulkCreate', () => {
    const userId = fakerPT_BR.string.uuid();
    const totalMessages = 2;

    const contacts: CreateContactDto[] = new Array(totalMessages)
      .fill(null)
      .map(() => ({
        oldid: fakerPT_BR.number.int({ min: 1 }),
        name: fakerPT_BR.person.fullName(),
        phone: fakerPT_BR.phone.number(),
        state: fakerPT_BR.location.state({ abbreviated: true }),
        userId,
      }));
    const expectedResults: Result<ContactModel, ErrorResponse>[] = contacts.map(
      (contact) => ({
        value: {
          ...contact,
          _id: fakerPT_BR.database.mongodbObjectId(),
        },
      }),
    );

    const subject = new ReplaySubject<Omit<ContactModel, '_id'>>();
    let result: Observable<Result<ContactModel, ErrorResponse>>;

    beforeAll(() => {
      expectedResults.forEach((expectedResult) => {
        createContactUseCase.run.mockResolvedValueOnce(expectedResult);
      });

      contacts.forEach((contact) => {
        subject.next(contact);
      });
    });

    it('should process a stream of contacts and send a message through notify', async () => {
      // for some reason, the function actually returns a promise
      result = await contactController.bulkCreate(subject.asObservable());

      let itemCount = 0;
      result.subscribe({
        next: (val) => {
          expect(val.value).toEqual(expectedResults[itemCount].value);
          itemCount++;
        },
      });

      subject.complete();
    });
  });
});
