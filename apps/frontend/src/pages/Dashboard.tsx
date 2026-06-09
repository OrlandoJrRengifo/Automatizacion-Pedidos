import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPedidos, type Pedido } from '../services/pedidos'
import BadgeEstado from '../components/BadgeEstado'

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<string>('todos')
  const navigate = useNavigate()

  useEffect(() => {
    getPedidos()
      .then(setPedidos)
      .finally(() => setCargando(false))
  }, [])

  const pedidosFiltrados = filtro === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtro)

  const conteo = {
    todos:     pedidos.length,
    pendiente: pedidos.filter(p => p.estado === 'pendiente').length,
    aprobado:  pedidos.filter(p => p.estado === 'aprobado').length,
    rechazado: pedidos.filter(p => p.estado === 'rechazado').length,
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black antialiased">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* Header */}
        <div className="mb-8 border-b-2 border-gray-300 pb-5">
          <p className="font-mono text-xs text-gray-800 tracking-wider uppercase mb-1 font-bold">
            Sistema de administración
          </p>
          <h1 className="text-2xl font-black tracking-tight text-black">
            Automatización de Pedidos
          </h1>
          <p className="text-gray-700 text-sm mt-1 font-medium">Monitoreo e ingesta de repuestos de autopartes · vía email</p>
        </div>

        {/* Contadores de Alto Contraste */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'todos',     label: 'Total Órdenes' },
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'aprobado',  label: 'Aprobados' },
            { key: 'rechazado', label: 'Rechazados' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-150 cursor-pointer shadow-xs
                ${filtro === key
                  ? 'border-black bg-white ring-1 ring-black/20 font-bold'
                  : 'border-gray-300 bg-white hover:border-gray-600 hover:bg-gray-50'}
              `}
            >
              <p className="font-mono text-3xl font-black text-black tracking-tight">{conteo[key as keyof typeof conteo]}</p>
              <p className="text-gray-800 text-xs mt-1 font-bold uppercase tracking-wider">{label}</p>
            </button>
          ))}
        </div>

        {/* Tabla Corporativa Marcada */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-sm overflow-hidden">
          {cargando ? (
            <div className="p-16 text-center text-gray-800 font-mono text-sm font-bold tracking-wide">
              Cargando registros de base de datos...
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="p-16 text-center text-gray-700 font-mono text-sm font-bold">
              No hay pedidos {filtro !== 'todos' ? `con estado "${filtro}"` : 'registrados'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-200">
                    <th className="text-left font-mono text-xs text-black px-6 py-4 uppercase tracking-wider font-bold">Cliente</th>
                    <th className="text-left font-mono text-xs text-black px-6 py-4 uppercase tracking-wider font-bold">Correo de origen</th>
                    <th className="text-center font-mono text-xs text-black px-6 py-4 uppercase tracking-wider font-bold">Ítems</th>
                    <th className="text-left font-mono text-xs text-black px-6 py-4 uppercase tracking-wider font-bold">Estado</th>
                    <th className="text-left font-mono text-xs text-black px-6 py-4 uppercase tracking-wider font-bold">Fecha recepción</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {pedidosFiltrados.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-bold text-black">{pedido.cliente}</td>
                      <td className="px-6 py-4 text-gray-900 font-mono text-xs font-semibold">{pedido.correo ?? '—'}</td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-black">{pedido.detalles.length}</td>
                      <td className="px-6 py-4"><BadgeEstado estado={pedido.estado} /></td>
                      <td className="px-6 py-4 text-gray-900 font-mono text-xs font-semibold">
                        {new Date(pedido.createdAt).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/pedidos/${pedido.id}`)}
                          className="text-white font-mono text-xs font-bold bg-gray-900 hover:bg-black px-3 py-1.5 rounded-md transition-all duration-150 cursor-pointer shadow-xs"
                        >
                          Ver orden →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}