import {
  Body, Controller, Get, Param,
  Patch, Post, Headers, UnauthorizedException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiParam } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo pedido desde el procesador Python' })
  @ApiHeader({ name: 'x-api-key', description: 'Clave de autenticacion' })
  crear(@Headers('x-api-key') apiKey: string, @Body() dto: CrearPedidoDto) {
    if (apiKey !== process.env.API_KEY) throw new UnauthorizedException();
    return this.pedidosService.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos' })
  listar() {
    return this.pedidosService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiParam({ name: 'id', description: 'UUID del pedido' })
  buscarPorId(@Param('id') id: string) {
    return this.pedidosService.buscarPorId(id);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Aprobar o rechazar un pedido' })
  @ApiParam({ name: 'id', description: 'UUID del pedido' })
  actualizarEstado(@Param('id') id: string, @Body() dto: ActualizarEstadoDto) {
    return this.pedidosService.actualizarEstado(id, dto);
  }
}