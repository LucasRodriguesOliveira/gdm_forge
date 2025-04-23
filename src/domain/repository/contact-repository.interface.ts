import { Contact } from '../model/contact.model';
import { PaginatedContact } from './paginated-contact.result';

export interface QueryContactOptions {
  state?: string;
  name?: string;
  userId: string;
  page: number;
  pageSize: number;
}

export interface IContactRepository {
  insert(contact: Partial<Contact>): Promise<Contact>;
  findById(contactId: Contact['_id'], userId: string): Promise<Contact>;
  findAll(query: QueryContactOptions): Promise<PaginatedContact>;
}
