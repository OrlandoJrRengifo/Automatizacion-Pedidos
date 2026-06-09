import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString, IsEmail, IsArray,
  ValidateNested, IsInt, IsNumber, Min, IsOptional
} from 'class-validator';

export class DetallePedidoDto {
  @ApiProperty({ example: 'REP-001' })
  @IsString()
   sku: string;

  @ApiProperty({ example: 'Filtro de aceite Toyota', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  precioUnitario: number;
}

export class CrearPedidoDto {
  @ApiProperty({ example: 'Taller El Rápido' })
  @IsString()
  cliente: string;

  @ApiProperty({ example: 'taller@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({ type: [DetallePedidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetallePedidoDto)
  detalles: DetallePedidoDto[];
}