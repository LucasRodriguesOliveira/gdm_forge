import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './infrastructure/config/env/env.config';
import { UseCaseProxyModule } from './infrastructure/usecase-proxy/usecase-proxy.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ControllerModule } from './interface/controller/controller.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    DatabaseModule,
    ControllerModule,
    UseCaseProxyModule.register(),
  ],
})
export class AppModule {}
