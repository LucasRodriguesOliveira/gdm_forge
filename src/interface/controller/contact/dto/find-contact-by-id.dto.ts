import { ContactModel } from '../../../../domain/model/contact.model';

export interface FindContactById {
  id: ContactModel['_id'];
  userId: string;
}
