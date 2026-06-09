import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [PrismaModule, PedidosModule],
})
export class AppModule {}