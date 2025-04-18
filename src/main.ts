import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getGrpcOptions } from './infrastructure/config/grpc/grpc.option';

async function bootstrap() {
  const { HOST, PORT } = process.env;

  console.log({ HOST, PORT });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    getGrpcOptions(`${HOST}:${PORT}`),
  );

  await app.listen();
}
bootstrap();
