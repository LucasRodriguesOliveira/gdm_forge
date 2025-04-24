import { User } from '../../../../domain/model/user.model';

export interface CreateContactDto {
  oldid: number;
  name: string;
  phone: string;
  state: string;
  userId: User['id'];
}
