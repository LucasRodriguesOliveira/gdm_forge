import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './infrastructure/config/env/env.config';
import { UseCaseProxyModule } from './infrastructure/usecase-proxy/usecase-proxy.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ControllerModule } from './interface/controller/controller.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseOptions } from './infrastructure/database/mongoose/mongoose.options';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    MongooseModule.forRootAsync(mongooseOptions),
    DatabaseModule,
    ControllerModule,
    UseCaseProxyModule.register(),
  ],
})
export class AppModule {}
