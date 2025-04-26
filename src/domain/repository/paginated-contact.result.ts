import { ContactModel } from '../model/contact.model';

export class PaginatedContact {
  contacts: ContactModel[];
  page: number;
  pageSize: number;
  total: number;
}
