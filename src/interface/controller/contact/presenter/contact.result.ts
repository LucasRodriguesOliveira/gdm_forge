import { Exclude, Expose } from 'class-transformer';
import { Contact } from 'src/domain/model/contact.model';

@Exclude()
export class ContactResult extends Contact {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  state: string;
}
