import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { ContactSchema, contactSchemaName } from './schema/contact.schema';
import { mongooseToken } from './mongoose.token';

export const contactProviderToken = Symbol('DB_MONGO_CONTACT_PROVIDER');

export const contactProvider: Provider = {
  provide: contactProviderToken,
  useFactory: (connection: Connection) =>
    connection.model(contactSchemaName, ContactSchema),
  inject: [mongooseToken],
};
