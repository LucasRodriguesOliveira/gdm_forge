import { Contact } from '../model/contact.model';

export class PaginatedContact {
  contacts: Contact[];
  page: number;
  pageSize: number;
  total: number;
}
