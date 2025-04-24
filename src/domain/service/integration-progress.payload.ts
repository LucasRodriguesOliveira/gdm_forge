import { User } from '../model/user.model';

export interface IntegrationProgressPayload {
  userId: User['id'];
  progress: number;
}
