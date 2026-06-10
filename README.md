# Automatizacion-Pedidos

Automatización del proceso de recepción de pedidos de repuestos de autopartes vía correo electrónico, usando Power Automate, Python y NestJS.



## Arquitectura
Correo → Power Automate → FastAPI (Python) → NestJS → Supabase
↑
React Dashboard

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + Tailwind |
| Backend | NestJS + Prisma |
| Procesador | FastAPI + pandas |
| Base de datos | Supabase (PostgreSQL) |
| Automatización | Power Automate |
| Deploy | Railway |

## Variables de Entorno
Para que la aplicación funcione, crea un archivo `.env` en cada carpeta correspondiente (`apps/backend/`, `apps/processor/`, `apps/frontend/`) con las siguientes variables:

### Backend (`apps/backend/.env`)
| Variable | Descripción |
| :--- | :--- |
| `DATABASE_URL` | URL de conexión a Supabase (PostgreSQL). |
| `API_KEY` | Llave secreta para autorizar peticiones. |

### Processor (`apps/processor/.env`)
| Variable | Descripción |
| :--- | :--- |
| `BACKEND_URL` | URL donde corre el backend. |
| `API_KEY` | La misma llave secreta definida en el backend. |

### Frontend (`apps/frontend/.env`)
| Variable | Descripción |
| :--- | :--- |
| `VITE_API_URL` | URL base de tu API Backend. |

---

## Flujo de Recepción (Power Automate)
Para que la automatización procese los pedidos correctamente:

1. **Destino:** El correo debe ser enviado a la cuenta configurada en el conector de Outlook.
2. **Asunto:** Debe contener la palabra **"Pedido"** (ej. "Pedido de repuestos - Junio").
3. **Archivo Adjunto:** Incluir un Excel (.xlsx) con la siguiente estructura:

| Cliente | Correo | SKU | Descripcion | Cantidad | Precio_Unitario |
|---|---|---|---|---|---|
| Nombre | correo@ejemplo.com | IND-001 | Repuesto X | 10 | 1500.00 |

*Nota: La primera fila de datos define el cliente y correo de contacto.*

## Despliegue (Producción)
Los servicios están desplegados en [Railway](https://railway.app/).
- **Dashboard:** https://automatizacion-pedidos.up.railway.app/
- **API Backend:** https://automatizacion-pedidos-production.up.railway.app/
- **API Processor:** https://servicio-python.up.railway.app/

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | /pedidos | Registrar nuevo pedido |
| GET | /pedidos | Listar todos los pedidos |
| PATCH | /pedidos/:id/estado | Aprobar o rechazar pedido |

