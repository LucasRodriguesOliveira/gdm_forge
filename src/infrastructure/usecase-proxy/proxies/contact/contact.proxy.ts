import { Provider } from '@nestjs/common';
import { CreateContactProxy } from './create-contact.proxy';
import { FindContactByIdProxy } from './find-contact-by-id.proxy';
import { ListContactProxy } from './list-contact.proxy';

export const ContactProxies: Map<symbol, Provider> = new Map([
  CreateContactProxy.Entry,
  FindContactByIdProxy.Entry,
  ListContactProxy.Entry,
]);
