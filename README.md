# App-new-delivery-Route

Aplicação web do painel de gestão de entregas da Route Delivery.

## Como rodar localmente

### Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação vai abrir em `http://localhost:3000`.

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

A API vai ficar em `http://localhost:4000/api`.

## Deploy

Para produção, o ideal é:
- Frontend: Vercel
- Backend: Render / Railway / Fly.io / VPS

Configure a variável de ambiente do frontend:

```bash
VITE_API_BASE_URL=https://sua-api-publica.com/api
```

## Observação

O backend deste projeto é um mock funcional em Node/Express para simular o sistema completo e permitir o uso real do painel.
