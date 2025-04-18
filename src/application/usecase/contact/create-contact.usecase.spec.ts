import { Test, TestingModule } from '@nestjs/testing';
import { CreateContactUseCase } from './create-contact.usecase';
import { CreateContactDto } from '../../../interface/controller/contact/dto/create-contact.dto';
import { faker, fakerPT_BR } from '@faker-js/faker/.';
import { ErrorCode } from '../../../domain/types/error-code.enum';

describe('CreateContactUseCase', () => {
  let createContactUseCase: CreateContactUseCase;
  const repository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    insert: jest.fn(),
  };
  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
    verbose: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateContactUseCase,
          useFactory: () => new CreateContactUseCase(repository, logger),
        },
      ],
    }).compile();

    createContactUseCase = app.get<CreateContactUseCase>(CreateContactUseCase);
  });

  it('should be defined', () => {
    expect(createContactUseCase).toBeDefined();
  });

  describe('Create contact', () => {
    const contactData: CreateContactDto = {
      id: faker.number.int(),
      name: faker.person.fullName(),
      phone: fakerPT_BR.phone.number({ style: 'national' }),
      state: fakerPT_BR.location.state({ abbreviated: true }),
    };

    describe('success', () => {
      beforeAll(() => {
        repository.insert.mockResolvedValueOnce(contactData);
      });

      it('should create a contact successfully', async () => {
        const result = await createContactUseCase.run(contactData);

        expect(result).toHaveProperty('value');
        expect(result).not.toHaveProperty('error');
        expect(result.value).toStrictEqual(contactData);
      });
    });

    describe('failure', () => {
      beforeAll(() => {
        repository.insert.mockRejectedValueOnce(new Error());
        logger.error.mockResolvedValueOnce(true);
      });

      it('should return an error', async () => {
        const result = await createContactUseCase.run(contactData);

        expect(result).not.toHaveProperty('value');
        expect(result).toHaveProperty('error');
        expect(result.error.code).toBe(ErrorCode.UNEXPECTED);
      });
    });
  });
});
