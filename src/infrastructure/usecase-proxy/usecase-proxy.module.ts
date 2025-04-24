import { DynamicModule, Module } from '@nestjs/common';
import { ContactProxies } from './proxies/contact/contact.proxy';
import { RepositoryModule } from '../repository/repository.module';
import { LoggerModule } from '../logger/logger.module';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [RepositoryModule, LoggerModule, ServiceModule],
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
