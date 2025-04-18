import { Module } from '@nestjs/common';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { ContactController } from './contact/contact.controller';

@Module({
  imports: [UseCaseProxyModule.register()],
  controllers: [ContactController],
})
export class ControllerModule {}
