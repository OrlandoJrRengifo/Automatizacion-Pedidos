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
    <div className="min-h-screen bg-carbon text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-accent text-xs tracking-widest uppercase mb-1">
          Sistema de pedidos
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Automatización de Pedidos
        </h1>
        <p className="text-muted text-sm mt-1">Repuestos de autopartes · vía email</p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { key: 'todos',     label: 'Total' },
          { key: 'pendiente', label: 'Pendientes' },
          { key: 'aprobado',  label: 'Aprobados' },
          { key: 'rechazado', label: 'Rechazados' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`
              text-left p-4 rounded-lg border transition-all
              ${filtro === key
                ? 'border-accent bg-accent/5'
                : 'border-border bg-surface hover:border-muted'}
            `}
          >
            <p className="font-mono text-2xl font-medium">{conteo[key as keyof typeof conteo]}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {cargando ? (
          <div className="p-12 text-center text-muted font-mono text-sm">
            Cargando pedidos...
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-muted font-mono text-sm">
            No hay pedidos {filtro !== 'todos' ? `con estado "${filtro}"` : 'registrados'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-mono text-xs text-muted px-5 py-3 uppercase tracking-wider">Cliente</th>
                <th className="text-left font-mono text-xs text-muted px-5 py-3 uppercase tracking-wider">Correo</th>
                <th className="text-left font-mono text-xs text-muted px-5 py-3 uppercase tracking-wider">Ítems</th>
                <th className="text-left font-mono text-xs text-muted px-5 py-3 uppercase tracking-wider">Estado</th>
                <th className="text-left font-mono text-xs text-muted px-5 py-3 uppercase tracking-wider">Fecha</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido, i) => (
                <tr
                  key={pedido.id}
                  className={`border-b border-border/50 hover:bg-panel transition-colors ${i % 2 === 0 ? '' : 'bg-panel/30'}`}
                >
                  <td className="px-5 py-4 font-medium">{pedido.cliente}</td>
                  <td className="px-5 py-4 text-muted font-mono text-xs">{pedido.correo ?? '—'}</td>
                  <td className="px-5 py-4 font-mono">{pedido.detalles.length}</td>
                  <td className="px-5 py-4"><BadgeEstado estado={pedido.estado} /></td>
                  <td className="px-5 py-4 text-muted font-mono text-xs">
                    {new Date(pedido.createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => navigate(`/pedidos/${pedido.id}`)}
                      className="text-accent font-mono text-xs hover:underline"
                    >
                      Ver →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}