import { Contact } from '../../../../domain/model/contact.model';

export interface FindContactById {
  id: Contact['_id'];
  userId: string;
}
