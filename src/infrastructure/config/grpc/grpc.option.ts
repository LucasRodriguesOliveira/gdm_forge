import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getGrpcOptions = (url: string): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    package: 'contact',
    protoPath: join(__dirname, '../../grpc/contact.proto'),
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg).addToServer(server);
    },
    url,
  },
});
