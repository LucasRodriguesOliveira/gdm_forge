import { Contact } from '../model/contact.model';

export interface QueryContactOptions {
  state?: string;
  name?: string;
}

export interface IContactRepository {
  insert(contact: Partial<Contact>): Promise<Contact>;
  findById(contactId: number): Promise<Contact>;
  findAll(query: QueryContactOptions): Promise<Contact[]>;
}
