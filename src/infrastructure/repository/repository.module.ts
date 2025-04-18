import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ContactRepository } from './contact.repository';

@Module({
  imports: [DatabaseModule],
  providers: [ContactRepository],
  exports: [ContactRepository],
})
export class RepositoryModule {}
