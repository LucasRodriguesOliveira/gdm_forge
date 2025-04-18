import { Inject } from '@nestjs/common';
import {
  IContactRepository,
  QueryContactOptions,
} from 'src/domain/repository/contact-repository.interface';
import { contactProviderToken } from '../database/mongoose/contact.provider';
import { Model, RootFilterQuery } from 'mongoose';
import { IContactModel } from '../database/mongoose/schema/contact.schema';
import { Contact } from 'src/domain/model/contact.model';

export class ContactRepository implements IContactRepository {
  constructor(
    @Inject(contactProviderToken)
    private contactModel: Model<IContactModel>,
  ) {}

  public async insert(contactData: Partial<Contact>): Promise<Contact> {
    const contactCreated = new this.contactModel(contactData);

    return contactCreated.save();
  }

  public async findAll(query: QueryContactOptions): Promise<Contact[]> {
    let filter: RootFilterQuery<IContactModel> = {};

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

    return this.contactModel.find(filter).exec();
  }

  findById(contactId: number): Promise<Contact> {
    return this.contactModel.findOne({ id: contactId }).exec();
  }
}
