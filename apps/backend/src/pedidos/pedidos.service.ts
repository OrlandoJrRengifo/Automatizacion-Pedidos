import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearPedidoDto) {
    return this.prisma.pedido.create({
      data: {
        cliente: dto.cliente,
        correo: dto.correo,
        detalles: {
          create: dto.detalles.map((d) => ({
            sku: d.sku,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
          })),
        },
      },
      include: { detalles: true },
    });
  }

  async listar() {
    return this.prisma.pedido.findMany({
      include: { detalles: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async buscarPorId(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { detalles: true },
    });
    if (!pedido) throw new NotFoundException(`Pedido ${id} no encontrado`);
    return pedido;
  }

  async actualizarEstado(id: string, dto: ActualizarEstadoDto) {
    await this.buscarPorId(id);
    return this.prisma.pedido.update({
      where: { id },
      data: { estado: dto.estado },
    });
  }
}