import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export interface DetallePedido {
  id: string
  sku: string
  descripcion: string | null
  cantidad: number
  precioUnitario: number
}

export interface Pedido {
  id: string
  cliente: string
  correo: string | null
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  createdAt: string
  detalles: DetallePedido[]
}

export const getPedidos = () =>
  api.get<Pedido[]>('/pedidos').then(r => r.data)

export const getPedido = (id: string) =>
  api.get<Pedido>(`/pedidos/${id}`).then(r => r.data)

export const actualizarEstado = (id: string, estado: 'aprobado' | 'rechazado') =>
  api.patch(`/pedidos/${id}/estado`, { estado }).then(r => r.data)