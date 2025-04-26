import { Test, TestingModule } from '@nestjs/testing';
import { ListContactUseCase } from './list-contact.usecase';
import { fakerPT_BR } from '@faker-js/faker/.';
import { ErrorCode } from '../../../domain/types/error-code.enum';
import { PaginatedContact } from '../../../domain/repository/paginated-contact.result';

describe('ListContactUseCase', () => {
  let listContactUseCase: ListContactUseCase;

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
          provide: ListContactUseCase,
          useFactory: () => new ListContactUseCase(repository, logger),
        },
      ],
    }).compile();

    listContactUseCase = app.get<ListContactUseCase>(ListContactUseCase);
  });

  it('should be defined', () => {
    expect(listContactUseCase).toBeDefined();
  });

  describe('List contacts', () => {
    const query = {
      userId: fakerPT_BR.string.uuid(),
      pageSize: 10,
      page: 1,
    };

    const paginatedResponse: PaginatedContact = {
      total: 1,
      pageSize: 10,
      page: 1,
      contacts: [
        {
          _id: fakerPT_BR.database.mongodbObjectId(),
          oldid: fakerPT_BR.number.int(),
          name: fakerPT_BR.person.fullName(),
          phone: fakerPT_BR.phone.number(),
          state: fakerPT_BR.location.state({ abbreviated: true }),
          userId: query.userId,
        },
      ],
    };

    describe('success', () => {
      beforeAll(() => {
        repository.findAll.mockResolvedValueOnce(paginatedResponse);
      });

      it('should return a paginated list of contacts', async () => {
        const result = await listContactUseCase.run(query);

        expect(result).toHaveProperty('value');
        expect(result).not.toHaveProperty('error');
        expect(result.value).toStrictEqual(paginatedResponse);
      });
    });

    describe('failure', () => {
      beforeAll(() => {
        repository.findAll.mockRejectedValueOnce(new Error());
        logger.error.mockResolvedValueOnce(true);
      });

      it('should return an error when listing fails', async () => {
        const result = await listContactUseCase.run(query);

        expect(result).not.toHaveProperty('value');
        expect(result).toHaveProperty('error');
        expect(result.error.code).toBe(ErrorCode.UNEXPECTED);
      });
    });
  });
});
