import { Provider } from '@nestjs/common';
import { mongooseProvider } from './mongoose/mongoose.provider';
import { contactProvider } from './mongoose/contact.provider';

export const databaseProvider: Provider[] = [mongooseProvider, contactProvider];
