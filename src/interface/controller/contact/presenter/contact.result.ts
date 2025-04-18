import { Exclude, Expose } from 'class-transformer';
import { Contact } from 'src/domain/model/contact.model';

@Exclude()
export class ContactResult extends Contact {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  state: string;
}
