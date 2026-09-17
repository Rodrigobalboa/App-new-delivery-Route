# App-new-delivery-Route

Aplicação web do painel de gestão de entregas da Route Delivery.

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Ajuste a API:
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com a URL do backend real, por exemplo:
   ```bash
   VITE_API_BASE_URL=https://api-sua-app.com/api
   ```
3. Inicie o projeto:
   ```bash
   npm run dev
   ```
   A aplicação vai abrir em `http://localhost:3000`.

## Build de produção

```bash
npm run build
```

## Subir no ar

A melhor abordagem é:
- Frontend: Vercel / Netlify
- Backend: Render / Railway / Fly.io / VPS

O frontend já está preparado para receber a URL da API por variável de ambiente (`VITE_API_BASE_URL`).
O backend precisa estar disponível publicamente e a URL real deve ser configurada no deploy do frontend.

## Observação importante

A aplicação original usa `http://localhost:4000/api` como base para o backend. Para publicar em produção, o valor precisa ser trocado para a URL real da API pública do seu servidor.
