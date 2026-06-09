import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPedido, actualizarEstado, type Pedido } from '../services/pedidos'
import BadgeEstado from '../components/BadgeEstado'

export default function DetallePedido() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    if (!id) return
    getPedido(id)
      .then(setPedido)
      .finally(() => setCargando(false))
  }, [id])

  const handleEstado = async (estado: 'aprobado' | 'rechazado') => {
    if (!id) return
    setProcesando(true)
    await actualizarEstado(id, estado)
    const actualizado = await getPedido(id)
    setPedido(actualizado)
    setProcesando(false)
  }

  const total = pedido?.detalles.reduce(
    (acc, d) => acc + d.cantidad * d.precioUnitario, 0
  ) ?? 0

  if (cargando) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="font-mono text-black font-bold text-sm">Cargando información de la orden...</p>
    </div>
  )

  if (!pedido) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="font-mono text-red-700 font-bold text-sm">El número de pedido no existe.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 text-black antialiased p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Volver */}
        <button
          onClick={() => navigate('/')}
          className="font-mono text-xs text-gray-800 hover:text-black mb-6 inline-flex items-center gap-1.5 transition-colors cursor-pointer group font-bold"
        >
          <span>←</span> Volver al dashboard
        </button>

        {/* Ficha del pedido con bordes definidos */}
        <div className="bg-white border-2 border-gray-300 p-6 md:p-8 rounded-xl shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gray-200 pb-5 mb-6">
            <div>
              <p className="font-mono text-gray-700 text-xs tracking-wider uppercase mb-1 font-bold">Análisis de Requerimiento</p>
              <h2 className="text-xl font-black text-black tracking-tight">{pedido.cliente}</h2>
              <p className="text-black text-xs font-mono font-bold mt-1">{pedido.correo ?? 'sin-correo@indufaros.com'}</p>
            </div>
            <div className="sm:text-right flex flex-col sm:items-end gap-1.5">
              <BadgeEstado estado={pedido.estado} />
              <p className="text-gray-900 font-mono text-xs font-bold">
                {new Date(pedido.createdAt).toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Tabla de Repuestos */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-200">
                  <th className="text-left font-mono text-xs text-black px-5 py-3 uppercase tracking-wider font-bold">SKU</th>
                  <th className="text-left font-mono text-xs text-black px-5 py-3 uppercase tracking-wider font-bold">Descripción del repuesto</th>
                  <th className="text-right font-mono text-xs text-black px-5 py-3 uppercase tracking-wider font-bold">Cant.</th>
                  <th className="text-right font-mono text-xs text-black px-5 py-3 uppercase tracking-wider font-bold">Precio Unit.</th>
                  <th className="text-right font-mono text-xs text-black px-5 py-3 uppercase tracking-wider font-bold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {pedido.detalles.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-black text-black">{d.sku}</td>
                    <td className="px-5 py-3.5 text-black font-medium">{d.descripcion ?? 'Sin descripción en cotización'}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-black font-bold">{d.cantidad}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-gray-900 font-semibold">
                      ${d.precioUnitario.toLocaleString('es-CO')}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-black">
                      ${(d.cantidad * d.precioUnitario).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-200">
                  <td colSpan={4} className="px-5 py-4 text-right font-mono text-xs text-black uppercase tracking-wider font-bold">
                    Total Cotizado
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-black text-black text-base">
                    ${total.toLocaleString('es-CO')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Botones */}
        {pedido.estado === 'pendiente' && (
          <div className="flex gap-3 justify-end items-center bg-white border-2 border-gray-300 p-4 rounded-xl shadow-xs">
            <span className="text-xs font-mono text-gray-900 mr-auto hidden sm:inline font-bold">⚠️ Requiere verificación antes de autorizar</span>
            <button
              disabled={procesando}
              onClick={() => handleEstado('rechazado')}
              className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-mono text-xs font-bold uppercase tracking-wider hover:bg-gray-100 hover:border-gray-500 transition-all duration-150 disabled:opacity-40 cursor-pointer"
            >
              Rechazar
            </button>
            <button
              disabled={procesando}
              onClick={() => handleEstado('aprobado')}
              className="px-5 py-2 rounded-lg bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all duration-150 shadow-xs disabled:opacity-40 cursor-pointer"
            >
              {procesando ? 'Procesando...' : 'Aprobar Pedido'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}