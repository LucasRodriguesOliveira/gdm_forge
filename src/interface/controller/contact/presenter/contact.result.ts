import { Exclude, Expose } from 'class-transformer';
import { ContactModel } from '../../../../domain/model/contact.model';

@Exclude()
export class ContactResult extends ContactModel {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  state: string;
}
