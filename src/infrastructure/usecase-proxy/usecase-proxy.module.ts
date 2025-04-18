import { DynamicModule, Module } from '@nestjs/common';
import { ContactProxies } from './proxies/contact/contact.proxy';
import { RepositoryModule } from '../repository/repository.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [RepositoryModule, LoggerModule],
})
export class UseCaseProxyModule {
  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [...ContactProxies.values()],
      exports: [...ContactProxies.keys()],
    };
  }
}
