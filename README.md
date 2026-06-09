# Automatizacion-Pedidos
Automatización del proceso de recepción de pedidos de repuestos de autopartes
vía correo electrónico, usando Power Automate, Python y NestJS.

## Arquitectura
Correo → Power Automate → FastAPI (Python) → NestJS → Supabase
↑
React Dashboard

## Stack

| Capa | Tecnología |
| Frontend | React + Vite + Tailwind |
| Backend | NestJS + Prisma |
| Procesador | FastAPI + pandas |
| Base de datos | Supabase (PostgreSQL) |
| Automatización | Power Automate |
| Deploy frontend | Vercel |
| Deploy backend/processor | Koyeb |

## Requisitos

- Node.js 20+
- Python 3.11+
- npm o pnpm
- Prisma v6

## Configuración inicial

Clona el repo y copia los archivos de entorno:

```bash
git clone https://github.com/tu-usuario/Automatizacion-Pedidos.git
cd order-intake-automation

cp apps/backend/.env.example   apps/backend/.env
cp apps/processor/.env.example apps/processor/.env
cp apps/frontend/.env.example  apps/frontend/.env
```

## Backend (NestJS)

```bash
cd apps/backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Corre en `http://localhost:3000`

## Processor (FastAPI)

```bash
cd apps/processor
python -m venv venv
source venv/bin/activate       
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Corre en `http://localhost:8000`

## Frontend (React)

```bash
cd apps/frontend
npm install
npm run dev
```

Corre en `http://localhost:5173`

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | /pedidos | Registrar nuevo pedido |
| GET | /pedidos | Listar todos los pedidos |
| PATCH | /pedidos/:id/estado | Aprobar o rechazar pedido |

