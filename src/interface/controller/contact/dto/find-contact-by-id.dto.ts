import { Contact } from '../../../../domain/model/contact.model';

export interface FindContactById {
  id: Contact['id'];
  userId: string;
}
