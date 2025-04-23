import { Inject } from '@nestjs/common';
import {
  IContactRepository,
  QueryContactOptions,
} from 'src/domain/repository/contact-repository.interface';
import { contactProviderToken } from '../database/mongoose/contact.provider';
import { Model, RootFilterQuery } from 'mongoose';
import { IContactModel } from '../database/mongoose/schema/contact.schema';
import { Contact } from 'src/domain/model/contact.model';
import { PaginatedContact } from '../../domain/repository/paginated-contact.result';

export class ContactRepository implements IContactRepository {
  constructor(
    @Inject(contactProviderToken)
    private contactModel: Model<IContactModel>,
  ) {}

  public async insert(contactData: Partial<Contact>): Promise<Contact> {
    const contactCreated = new this.contactModel(contactData);

    const result = await contactCreated.save();

    return {
      ...result.toJSON(),
      _id: `${result._id}`,
    };
  }

  public async findAll(query: QueryContactOptions): Promise<PaginatedContact> {
    let filter: RootFilterQuery<IContactModel> = {
      userId: query.userId,
    };

    if (query?.name) {
      filter = {
        name: query.name,
      };
    }

    if (query?.state) {
      filter = {
        ...filter,
        state: query.state,
      };
    }

    const skip = query.pageSize * query.page;
    const limit = query.pageSize;

    const result = await this.contactModel
      .find(filter, null, { skip, limit })
      .exec();

    const count = await this.contactModel.countDocuments(filter);

    return {
      total: count,
      contacts: result.map((item) => ({
        ...item.toJSON(),
        _id: `${item._id}`,
      })),
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  public async findById(
    contactId: Contact['_id'],
    userId: string,
  ): Promise<Contact> {
    const result = await this.contactModel
      .findOne({ _id: contactId, userId })
      .exec();

    return {
      ...result.toJSON(),
      _id: `${result._id}`,
    };
  }
}
