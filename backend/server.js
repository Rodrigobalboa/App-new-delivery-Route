import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'route-delivery-dev-secret';

app.use(cors());
app.use(express.json());

const contas = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@routedelivery.com',
    senha: '12345678',
    cargo: 'Gerente',
  },
];

const entregadores = [
  { id: 1, nomeCompleto: 'Diego Alves', telefone: '(11) 96654-8821', email: 'diego@routedelivery.com', status: 'DISPONIVEL' },
  { id: 2, nomeCompleto: 'Fabiana Reis', telefone: '(11) 95521-7743', email: 'fabiana@routedelivery.com', status: 'EM_ROTA' },
  { id: 3, nomeCompleto: 'Paulo Cesar', telefone: '(11) 98712-4401', email: 'paulo@routedelivery.com', status: 'DISPONIVEL' },
];

const pedidos = [
  { id: 1, codigo: 'PD-4473', clienteNome: 'Rodrigo Fontes', endereco: 'Rua Frei Caneca, 300 - Consolação', entregador: null, comercio: { nomeFantasia: 'Café Real' }, status: 'PREPARANDO', valor: 132.2, prazoDesejado: '—', observacao: 'Sem restrição.' },
  { id: 2, codigo: 'PD-4472', clienteNome: 'Aline Duarte', endereco: 'Rua Bela Cintra, 900 - Consolação', entregador: null, comercio: { nomeFantasia: 'Marmita Viva' }, status: 'PREPARANDO', valor: 55.0, prazoDesejado: '—', observacao: 'Entrega urgente.' },
  { id: 3, codigo: 'PD-4471', clienteNome: 'Marcela Ito', endereco: 'Rua Vergueiro, 1200 - Vila Mariana', entregador: { id: 1, nomeCompleto: 'Diego Alves' }, comercio: { nomeFantasia: 'Restaurante Sabor Real' }, status: 'EM_ROTA', valor: 89.9, prazoDesejado: '18:40', observacao: 'Cliente prefere contato por WhatsApp.' },
  { id: 4, codigo: 'PD-4470', clienteNome: 'Renato Souza', endereco: 'Av. Paulista, 900 - Bela Vista', entregador: { id: 2, nomeCompleto: 'Fabiana Reis' }, comercio: { nomeFantasia: 'Mercado Villa' }, status: 'ENTREGUE', valor: 154.0, prazoDesejado: '17:52', observacao: 'Entrega concluída com sucesso.' },
  { id: 5, codigo: 'PD-4469', clienteNome: 'Camila Nogueira', endereco: 'Rua Augusta, 2310 - Cerqueira César', entregador: null, comercio: { nomeFantasia: 'Padaria Boa Vista' }, status: 'PENDENTE', valor: 42.5, prazoDesejado: '—', observacao: 'Aguardando confirmação de preparo.' },
  { id: 6, codigo: 'PD-4468', clienteNome: 'João Pedro Lima', endereco: 'Al. Santos, 45 - Jardim Paulista', entregador: { id: 1, nomeCompleto: 'Diego Alves' }, comercio: { nomeFantasia: 'Mercado Vila Nova' }, status: 'ATRASADO', valor: 201.3, prazoDesejado: '17:10', observacao: 'Cliente reportou atraso no trânsito.' },
  { id: 7, codigo: 'PD-4467', clienteNome: 'Beatriz Fonseca', endereco: 'Rua Oscar Freire, 780 - Jardins', entregador: { id: 2, nomeCompleto: 'Fabiana Reis' }, comercio: { nomeFantasia: 'Sushi Top' }, status: 'ENTREGUE', valor: 76.0, prazoDesejado: '16:48', observacao: 'Pedido entregue sem intercorrências.' },
  { id: 8, codigo: 'PD-4466', clienteNome: 'Thiago Martins', endereco: 'Rua Haddock Lobo, 330 - Cerqueira César', entregador: null, comercio: { nomeFantasia: 'Farmácia Bem Estar' }, status: 'PENDENTE', valor: 118.9, prazoDesejado: '—', observacao: 'Recebimento em fila de produção.' },
];

const resetTokens = new Map();

function signToken(conta) {
  return jwt.sign(
    { sub: conta.id, email: conta.email, nome: conta.nome, cargo: conta.cargo },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ erro: 'Token ausente ou inválido.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ erro: 'Sessão inválida.' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API rodando', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  const conta = contas.find((item) => item.email.toLowerCase() === String(email).trim().toLowerCase());
  if (!conta || conta.senha !== String(senha)) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  }

  const token = signToken(conta);

  return res.json({
    token,
    conta: {
      id: conta.id,
      nome: conta.nome,
      email: conta.email,
      cargo: conta.cargo,
    },
  });
});

app.post('/api/auth/esqueci-senha', (req, res) => {
  const { email } = req.body || {};
  const conta = contas.find((item) => item.email.toLowerCase() === String(email || '').trim().toLowerCase());

  if (!conta) {
    return res.status(404).json({ erro: 'E-mail não encontrado.' });
  }

  const token = `dev-reset-${Math.random().toString(36).slice(2)}`;
  resetTokens.set(token, { email: conta.email, expiresAt: Date.now() + 60 * 60 * 1000 });

  return res.json({
    mensagem: 'Se esse e-mail estiver cadastrado, enviamos um link de redefinição.',
    devToken: token,
  });
});

app.post('/api/auth/redefinir-senha', (req, res) => {
  const { token, novaSenha } = req.body || {};

  if (!token || !novaSenha || String(novaSenha).trim().length < 8) {
    return res.status(400).json({ erro: 'Token e nova senha válidos são obrigatórios.' });
  }

  const reset = resetTokens.get(String(token));
  if (!reset || reset.expiresAt < Date.now()) {
    return res.status(400).json({ erro: 'Token de redefinição inválido ou expirado.' });
  }

  const conta = contas.find((item) => item.email.toLowerCase() === reset.email.toLowerCase());
  if (!conta) {
    return res.status(404).json({ erro: 'Conta não encontrada.' });
  }

  conta.senha = String(novaSenha);
  resetTokens.delete(String(token));

  return res.json({ mensagem: 'Senha redefinida com sucesso.' });
});

app.get('/api/pedidos', authRequired, (req, res) => {
  res.json(pedidos);
});

app.get('/api/entregadores', authRequired, (req, res) => {
  res.json(entregadores);
});

app.get('/api/pedidos/:id/logs', authRequired, (req, res) => {
  const pedido = pedidos.find((item) => item.id === Number(req.params.id));
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado.' });
  }

  const logs = [
    { id: 1, mensagem: `Pedido ${pedido.codigo} criado no sistema.`, timestamp: '2026-09-17T08:00:00.000Z' },
    { id: 2, mensagem: `Última atualização: ${pedido.status}.`, timestamp: '2026-09-17T09:30:00.000Z' },
  ];

  return res.json(logs);
});

app.patch('/api/pedidos/:id/pronto', authRequired, (req, res) => {
  const pedido = pedidos.find((item) => item.id === Number(req.params.id));
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado.' });
  }

  pedido.status = 'PREPARANDO';
  return res.json({ mensagem: `Pedido ${pedido.codigo} liberado para os entregadores.`, pedido });
});

app.patch('/api/pedidos/:id/finalizar', authRequired, (req, res) => {
  const pedido = pedidos.find((item) => item.id === Number(req.params.id));
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado.' });
  }

  pedido.status = 'ENTREGUE';
  return res.json({ mensagem: `Pedido ${pedido.codigo} finalizado com sucesso.`, pedido });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.listen(PORT, () => {
  console.log(`API Route Delivery rodando em http://localhost:${PORT}`);
});
