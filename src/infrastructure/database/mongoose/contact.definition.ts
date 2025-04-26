import { ModelDefinition } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './schema/contact.schema';

export const contactDefinition: ModelDefinition = {
  name: Contact.name,
  schema: ContactSchema,
};
