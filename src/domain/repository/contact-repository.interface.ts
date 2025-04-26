import { ContactModel } from '../model/contact.model';
import { PaginatedContact } from './paginated-contact.result';

export interface QueryContactOptions {
  state?: string;
  name?: string;
  userId: string;
  page: number;
  pageSize: number;
}

export interface IContactRepository {
  insert(contact: Partial<ContactModel>): Promise<ContactModel>;
  findById(
    contactId: ContactModel['_id'],
    userId: string,
  ): Promise<ContactModel>;
  findAll(query: QueryContactOptions): Promise<PaginatedContact>;
}
