import { Test, TestingModule } from '@nestjs/testing';
import { FindContactByIdUseCase } from './find-contact-by-id.usecase';
import { ContactModel } from '../../../domain/model/contact.model';
import { fakerPT_BR } from '@faker-js/faker/.';
import { ErrorCode } from '../../../domain/types/error-code.enum';

describe('FindContactByIdUseCase', () => {
  let findContactByIdUseCase: FindContactByIdUseCase;
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
          provide: FindContactByIdUseCase,
          useFactory: () => new FindContactByIdUseCase(repository, logger),
        },
      ],
    }).compile();

    findContactByIdUseCase = app.get<FindContactByIdUseCase>(
      FindContactByIdUseCase,
    );
  });

  it('should be defined', () => {
    expect(findContactByIdUseCase).toBeDefined();
  });

  describe('Find Contact', () => {
    const contact: ContactModel = {
      _id: fakerPT_BR.database.mongodbObjectId(),
      oldid: fakerPT_BR.number.int({ min: 1 }),
      name: fakerPT_BR.person.fullName(),
      phone: fakerPT_BR.phone.number(),
      state: fakerPT_BR.location.state({ abbreviated: true }),
      userId: fakerPT_BR.string.uuid(),
    };

    describe('success', () => {
      beforeAll(() => {
        repository.findById.mockResolvedValueOnce(contact);
      });

      it('should find a contact by id', async () => {
        const result = await findContactByIdUseCase.run(
          contact._id,
          contact.userId,
        );

        expect(result).toHaveProperty('value');
        expect(result).not.toHaveProperty('error');
        expect(result.value).toStrictEqual(contact);
      });
    });

    describe('failure', () => {
      beforeAll(() => {
        repository.findById.mockRejectedValueOnce(new Error());
        logger.error.mockResolvedValueOnce(true);
      });

      it('should return an error', async () => {
        const result = await findContactByIdUseCase.run(
          contact._id,
          contact.userId,
        );

        expect(result).not.toHaveProperty('value');
        expect(result).toHaveProperty('error');
        expect(result.error.code).toBe(ErrorCode.NOT_FOUND);
      });
    });
  });
});
