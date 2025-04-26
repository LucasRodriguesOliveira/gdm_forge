import {
  IContactRepository,
  QueryContactOptions,
} from 'src/domain/repository/contact-repository.interface';
import { Model, RootFilterQuery } from 'mongoose';
import { PaginatedContact } from '../../domain/repository/paginated-contact.result';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from '../database/mongoose/schema/contact.schema';
import { plainToInstance } from 'class-transformer';
import { ContactModel } from '../../domain/model/contact.model';

export class ContactRepository implements IContactRepository {
  constructor(
    @InjectModel(Contact.name)
    private contactModel: Model<Contact>,
  ) {}

  public async insert(
    contactData: Partial<ContactModel>,
  ): Promise<ContactModel> {
    const contactCreated = await this.contactModel.create(contactData);

    return plainToInstance(ContactModel, contactCreated.toObject());
  }

  public async findAll(query: QueryContactOptions): Promise<PaginatedContact> {
    let filter: RootFilterQuery<Contact> = {
      userId: query.userId,
    };

    if (query?.name) {
      filter = {
        ...filter,
        name: query.name,
      };
    }

    if (query?.state) {
      filter = {
        ...filter,
        state: query.state,
      };
    }

    const skip = query.pageSize * (query.page - 1);
    const limit = query.pageSize;

    const result = await this.contactModel
      .find(filter, null, { skip, limit })
      .exec();

    const count = await this.contactModel.countDocuments(filter);

    return {
      total: count,
      contacts: plainToInstance(
        ContactModel,
        result.map((item) => item.toObject()),
      ),
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  public async findById(
    contactId: ContactModel['_id'],
    userId: string,
  ): Promise<ContactModel> {
    const result = await this.contactModel
      .findOne({ _id: contactId, userId })
      .exec();

    return plainToInstance(ContactModel, result.toObject());
  }
}
