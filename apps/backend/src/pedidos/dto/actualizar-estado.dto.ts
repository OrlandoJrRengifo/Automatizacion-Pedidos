import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ActualizarEstadoDto {
  @ApiProperty({ enum: ['aprobado', 'rechazado'] })
  @IsIn(['aprobado', 'rechazado'])
  estado: string;
}