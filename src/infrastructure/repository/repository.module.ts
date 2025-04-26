import { Module } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseDefinitions } from '../database/mongoose/mongoose.definition';

@Module({
  imports: [MongooseModule.forFeature(mongooseDefinitions)],
  providers: [ContactRepository],
  exports: [ContactRepository],
})
export class RepositoryModule {}
