import { ContactRepository } from './contact.repository';
import { fakerPT_BR } from '@faker-js/faker/.';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Contact } from '../database/mongoose/schema/contact.schema';
import { Model } from 'mongoose';
import { ContactModel } from '../../domain/model/contact.model';
import { PaginatedContact } from '../../domain/repository/paginated-contact.result';
import { QueryContactOptions } from '../../domain/repository/contact-repository.interface';

const contactModelMock = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  countDocuments: jest.fn(),
};

describe('ContactRepository', () => {
  let contactRepository: ContactRepository;
  let contactModel: jest.Mocked<Model<Contact>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Contact.name),
          useValue: contactModelMock,
        },
        ContactRepository,
      ],
    }).compile();

    contactRepository = app.get<ContactRepository>(ContactRepository);
    contactModel = app.get(getModelToken(Contact.name));
  });

  it('should be defined', () => {
    expect(contactRepository).toBeDefined();
  });

  describe('insert', () => {
    const contactData = {
      _id: fakerPT_BR.database.mongodbObjectId(),
      name: fakerPT_BR.person.fullName(),
      phone: fakerPT_BR.phone.number(),
      state: fakerPT_BR.location.state({ abbreviated: true }),
      userId: fakerPT_BR.string.uuid(),
    };

    beforeAll(() => {
      contactModel.create.mockResolvedValueOnce({
        toObject: jest.fn().mockReturnValueOnce(contactData),
      } as any);
    });

    it('should insert a new contact', async () => {
      const result = await contactRepository.insert(contactData);

      expect(result).toEqual(contactData);
    });
  });

  describe('findAll', () => {
    const contactData: ContactModel = {
      _id: fakerPT_BR.database.mongodbObjectId(),
      oldid: fakerPT_BR.number.int({ min: 0 }),
      name: fakerPT_BR.person.fullName(),
      phone: fakerPT_BR.phone.number(),
      state: fakerPT_BR.location.state({ abbreviated: true }),
      userId: fakerPT_BR.string.uuid(),
    };
    const contacts: ContactModel[] = [contactData];
    const expected: PaginatedContact = {
      contacts,
      page: 1,
      pageSize: 10,
      total: 1,
    };

    const query: QueryContactOptions = {
      page: expected.page,
      pageSize: expected.pageSize,
      userId: contactData.userId,
      name: contactData.name,
      state: contactData.state,
    };

    beforeAll(() => {
      contactModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(
          contacts.map((item) => ({
            toObject: jest.fn().mockReturnValueOnce(item),
          })),
        ),
      } as any);
      contactModel.countDocuments.mockResolvedValueOnce(expected.total);
    });

    it('should return paginated contacts', async () => {
      const result = await contactRepository.findAll(query);

      const { userId, name, state } = contactData;
      const { page, pageSize } = query;
      const skip = (page - 1) * pageSize;
      const filter = { userId, name, state };
      const pagination = { skip, limit: pageSize };

      expect(contactModel.find).toHaveBeenCalledWith(filter, null, pagination);
      expect(contactModel.countDocuments).toHaveBeenCalledWith(filter);
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    const contactData: ContactModel = {
      _id: fakerPT_BR.database.mongodbObjectId(),
      oldid: fakerPT_BR.number.int({ min: 0 }),
      name: fakerPT_BR.person.fullName(),
      phone: fakerPT_BR.phone.number(),
      state: fakerPT_BR.location.state({ abbreviated: true }),
      userId: fakerPT_BR.string.uuid(),
    };

    beforeAll(() => {
      contactModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({
          toObject: jest.fn().mockReturnValueOnce(contactData),
        }),
      } as any);
    });

    it('should return a contact by id', async () => {
      const result = await contactRepository.findById(
        contactData._id,
        contactData.userId,
      );

      expect(contactModel.findOne).toHaveBeenCalledWith({
        _id: contactData._id,
        userId: contactData.userId,
      });
      expect(result).toEqual(contactData);
    });
  });
});
