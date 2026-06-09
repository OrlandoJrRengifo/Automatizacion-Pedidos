const colores = {
  pendiente: 'bg-pending/10 text-pending border-pending/30',
  aprobado:  'bg-approved/10 text-approved border-approved/30',
  rechazado: 'bg-rejected/10 text-rejected border-rejected/30',
}

const labels = {
  pendiente: 'Pendiente',
  aprobado:  'Aprobado',
  rechazado: 'Rechazado',
}

export default function BadgeEstado({ estado }: { estado: string }) {
  const clase = colores[estado as keyof typeof colores] ?? 'bg-muted/10 text-muted'
  return (
    <span className={`inline-block border text-xs font-mono px-2 py-0.5 rounded ${clase}`}>
      {labels[estado as keyof typeof labels] ?? estado}
    </span>
  )
}