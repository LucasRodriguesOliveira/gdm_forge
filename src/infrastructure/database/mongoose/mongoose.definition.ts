import { ModelDefinition } from '@nestjs/mongoose';
import { contactDefinition } from './contact.definition';

export const mongooseDefinitions: ModelDefinition[] = [contactDefinition];
