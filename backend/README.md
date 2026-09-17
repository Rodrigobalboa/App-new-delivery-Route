# Backend da Route Delivery

## Como rodar

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

A API vai ficar disponível em:
```bash
http://localhost:4000/api
```

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/auth/esqueci-senha`
- `POST /api/auth/redefinir-senha`
- `GET /api/pedidos`
- `GET /api/entregadores`
- `PATCH /api/pedidos/:id/pronto`
- `PATCH /api/pedidos/:id/finalizar`
- `GET /api/pedidos/:id/logs`

## Importante

Para publicar em produção, troque `JWT_SECRET` e configure um ambiente de produção seguro.
