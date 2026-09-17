import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Pencil,
  Phone,
  PlusCircle,
  Search,
  Settings,
  Truck,
  UserCog,
  Users,
  Wallet,
  MoreVertical,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const C = {
  ink: '#14181F',
  panel: '#1B212C',
  panelAlt: '#212837',
  line: '#2B3345',
  text: '#ECEEF3',
  muted: '#8993A8',
  faint: '#5B6478',
  amber: '#F2A63A',
  amberDim: '#4A3A1E',
  green: '#4FAE6D',
  greenDim: '#1E3327',
  red: '#E35B4F',
  redDim: '#3A2220',
  blue: '#5B8DEF',
  purple: '#9B7BEF',
  purpleDim: '#2A2340',
};

const fontHead = { fontFamily: "'Archivo', sans-serif" };
const fontBody = { fontFamily: "'IBM Plex Sans', sans-serif" };

const NAV = [
  { id: 'pedidos', label: 'Acompanhamento de Pedidos', icon: Package },
  { id: 'nova', label: 'Nova entrega', icon: PlusCircle },
  { id: 'cadastro', label: 'Cadastro', icon: Users },
  { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'config', label: 'Configurações', icon: Settings },
];

const PEDIDOS = [
  { id: 'PD-4471', cliente: 'Marcela Ito', endereco: 'Rua Vergueiro, 1200 - Vila Mariana', entregador: 'Diego Alves', status: 'em_rota', valor: 89.9, eta: '18:40' },
  { id: 'PD-4470', cliente: 'Renato Souza', endereco: 'Av. Paulista, 900 - Bela Vista', entregador: 'Fabiana Reis', status: 'entregue', valor: 154.0, eta: '17:52' },
  { id: 'PD-4469', cliente: 'Camila Nogueira', endereco: 'Rua Augusta, 2310 - Cerqueira César', entregador: '—', status: 'pendente', valor: 42.5, eta: '—' },
  { id: 'PD-4468', cliente: 'João Pedro Lima', endereco: 'Al. Santos, 45 - Jardim Paulista', entregador: 'Diego Alves', status: 'atrasado', valor: 201.3, eta: '17:10' },
  { id: 'PD-4467', cliente: 'Beatriz Fonseca', endereco: 'Rua Oscar Freire, 780 - Jardins', entregador: 'Fabiana Reis', status: 'entregue', valor: 76.0, eta: '16:48' },
  { id: 'PD-4466', cliente: 'Thiago Martins', endereco: 'Rua Haddock Lobo, 330 - Cerqueira César', entregador: '—', status: 'pendente', valor: 118.9, eta: '—' },
];

const RECEITA = [
  { mes: 'Abr', valor: 18200 },
  { mes: 'Mai', valor: 21400 },
  { mes: 'Jun', valor: 19800 },
  { mes: 'Jul', valor: 24100 },
  { mes: 'Ago', valor: 26700 },
  { mes: 'Set', valor: 15300 },
];

const VOLUME = [
  { dia: 'Seg', entregas: 42 },
  { dia: 'Ter', entregas: 51 },
  { dia: 'Qua', entregas: 38 },
  { dia: 'Qui', entregas: 60 },
  { dia: 'Sex', entregas: 74 },
  { dia: 'Sáb', entregas: 55 },
  { dia: 'Dom', entregas: 20 },
];

const CLIENTES = [
  { nome: 'Marcela Ito', tipo: 'Cliente', contato: '(11) 98211-0043', pedidos: 12 },
  { nome: 'Renato Souza', tipo: 'Cliente', contato: '(11) 97733-2210', pedidos: 5 },
  { nome: 'Diego Alves', tipo: 'Entregador', contato: '(11) 96654-8821', pedidos: 340 },
  { nome: 'Fabiana Reis', tipo: 'Entregadora', contato: '(11) 95521-7743', pedidos: 298 },
];

const STATUS_MAP = {
  preparando: { label: 'Preparando', color: C.purple, bg: C.purpleDim },
  em_rota: { label: 'Em rota', color: C.blue, bg: '#1D2A45' },
  entregue: { label: 'Entregue', color: C.green, bg: C.greenDim },
  pendente: { label: 'Pendente', color: C.amber, bg: C.amberDim },
  atrasado: { label: 'Atrasado', color: C.red, bg: C.redDim },
  cancelado: { label: 'Cancelado', color: C.faint, bg: C.panelAlt },
};

const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

function Pill({ status }) {
  const item = STATUS_MAP[status] || STATUS_MAP.pendente;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs"
      style={{ background: item.bg, color: item.color, ...fontBody }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
      {item.label}
    </span>
  );
}

function StatCard({ label, value, delta, deltaGood, icon: Icon }) {
  return (
    <div className="flex-1 rounded-sm p-4" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide" style={{ color: C.faint, ...fontBody }}>{label}</span>
        <Icon size={15} style={{ color: C.faint }} />
      </div>
      <div className="text-2xl font-semibold" style={{ color: C.text, ...fontHead }}>{value}</div>
      {delta && (
        <div className="text-xs mt-1.5" style={{ color: deltaGood ? C.green : C.red, ...fontBody }}>{delta}</div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: C.text, ...fontHead }}>{title}</h2>
        {subtitle && <p className="text-sm mt-1" style={{ color: C.muted, ...fontBody }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

async function apiFetch(path, { token, method = 'GET', body } = {}) {
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (resp.status === 204) return null;

  let data = null;
  try {
    data = await resp.json();
  } catch (error) {
    // Sem body JSON
  }

  if (!resp.ok) {
    throw new Error((data && data.erro) || `Erro na requisição (${resp.status}).`);
  }

  return data;
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('admin@routedelivery.com');
  const [senha, setSenha] = useState('12345678');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Informe e-mail e senha.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, senha },
      });
      onLogin(data.token, data.conta || { nome: 'Administrador' });
    } catch (err) {
      setErro(err.message || 'Não foi possível fazer login.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ background: C.ink, minHeight: '100vh', ...fontBody }} className="flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-sm p-6" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 rounded-sm flex items-center justify-center" style={{ background: C.amber }}>
            <Truck size={14} style={{ color: C.ink }} />
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: C.text, ...fontHead }}>Route Delivery</span>
        </div>

        <h1 className="text-lg font-semibold mb-1" style={{ color: C.text, ...fontHead }}>Entrar no painel</h1>
        <p className="text-xs mb-5" style={{ color: C.muted, ...fontBody }}>
          Use a conta gerencial cadastrada no backend.
        </p>

        {erro && (
          <div className="rounded-sm px-3 py-2.5 mb-4 text-xs" style={{ background: C.redDim, color: C.red, ...fontBody }}>{erro}</div>
        )}

        <div className="flex flex-col gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted, ...fontBody }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@routedelivery.com"
              className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
              style={{ background: C.panelAlt, border: `1px solid ${C.line}`, color: C.text, ...fontBody }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted, ...fontBody }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
              style={{ background: C.panelAlt, border: `1px solid ${C.line}`, color: C.text, ...fontBody }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={carregando}
          className="w-full px-4 py-2.5 rounded-sm text-sm font-medium"
          style={{ background: C.amber, color: C.ink, opacity: carregando ? 0.6 : 1, ...fontBody }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-xs mt-4" style={{ color: C.faint, ...fontBody }}>
          Backend não configurado ainda? Ajuste a variável <strong>VITE_API_BASE_URL</strong> para o endereço real da API.
        </p>
      </div>
    </div>
  );
}

function DashboardApp({ token, conta }) {
  const [activeNav, setActiveNav] = useState('pedidos');
  const [busca, setBusca] = useState('');

  const pedidosFiltrados = useMemo(() => {
    const query = busca.trim().toLowerCase();
    return PEDIDOS.filter((pedido) => {
      if (!query) return true;
      return (
        pedido.id.toLowerCase().includes(query) ||
        pedido.cliente.toLowerCase().includes(query) ||
        pedido.endereco.toLowerCase().includes(query)
      );
    });
  }, [busca]);

  const totalVendas = PEDIDOS.reduce((acc, pedido) => acc + pedido.valor, 0);
  const entregasHoje = 146;
  const atrasados = PEDIDOS.filter((p) => p.status === 'atrasado').length;

  return (
    <div style={{ minHeight: '100vh', background: C.ink, color: C.text, ...fontBody }}>
      <div className="d-flex" style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 240, background: C.panel, borderRight: `1px solid ${C.line}`, padding: 18 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-sm flex items-center justify-center" style={{ background: C.amber }}>
              <Truck size={16} style={{ color: C.ink }} />
            </div>
            <div>
              <div style={{ color: C.text, ...fontHead, fontSize: 18 }}>Route Delivery</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Ops Center</div>
            </div>
          </div>

          <nav style={{ display: 'grid', gap: 8 }}>
            {NAV.map(({ id, label, icon: Icon }) => {
              const active = id === activeNav;
              return (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: active ? `1px solid ${C.amber}` : `1px solid transparent`,
                    background: active ? 'rgba(242,166,58,0.12)' : 'transparent',
                    color: active ? C.text : C.muted,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} />
                    <span style={{ ...fontBody }}>{label}</span>
                  </span>
                  <ChevronRight size={14} />
                </button>
              );
            })}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 28 }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2 }}>Painel gerencial</div>
              <h1 style={{ margin: 0, fontSize: 30, ...fontHead }}>Visão geral da operação</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: C.faint }} />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar pedido ou cliente"
                  style={{
                    background: C.panel,
                    border: `1px solid ${C.line}`,
                    color: C.text,
                    borderRadius: 6,
                    padding: '10px 12px 10px 34px',
                    width: 260,
                  }}
                />
              </div>
              <button style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, padding: 10, color: C.text }}>
                <Bell size={16} />
              </button>
              <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, fontWeight: 700 }}>
                  {conta?.nome?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Logado como</div>
                  <div style={{ fontSize: 13, ...fontHead }}>{conta?.nome || 'Administrador'}</div>
                </div>
              </div>
            </div>
          </header>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 22 }}>
            <StatCard label="Receita do mês" value={formatCurrency(totalVendas * 16.5)} delta="+12,8% vs. mês anterior" deltaGood icon={DollarSign} />
            <StatCard label="Entregas hoje" value={String(entregasHoje)} delta="+5,4% no pico" deltaGood icon={Truck} />
            <StatCard label="Pedidos em rota" value={String(PEDIDOS.filter((p) => p.status === 'em_rota').length)} delta="3 com ETA menor que 30 min" deltaGood icon={Clock} />
            <StatCard label="Atrasados" value={String(atrasados)} delta="-2 no último turno" deltaGood={false} icon={CheckCircle2} />
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 22 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: 18 }}>
              <SectionHeader title="Receita" subtitle="Últimos 6 meses" action={<button style={{ background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 6, color: C.text, padding: '8px 10px' }}>Ver relatório</button>} />
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={RECEITA}>
                    <CartesianGrid stroke={C.line} strokeDasharray="4 4" />
                    <XAxis dataKey="mes" stroke={C.muted} />
                    <YAxis stroke={C.muted} />
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Receita']} />
                    <Line type="monotone" dataKey="valor" stroke={C.amber} strokeWidth={3} dot={{ r: 4, fill: C.amber }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: 18 }}>
              <SectionHeader title="Volume de entregas" subtitle="Últimos 7 dias" />
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={VOLUME}>
                    <CartesianGrid stroke={C.line} strokeDasharray="4 4" />
                    <XAxis dataKey="dia" stroke={C.muted} />
                    <YAxis stroke={C.muted} />
                    <Tooltip />
                    <Bar dataKey="entregas" fill={C.blue} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 18 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: 18 }}>
              <SectionHeader title="Pedidos" subtitle="Lista ativa" action={<button style={{ background: C.amber, color: C.ink, border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 600 }}>+ Nova entrega</button>} />

              <div style={{ overflow: 'hidden', border: `1px solid ${C.line}`, borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: C.panelAlt }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 14px', color: C.muted, fontSize: 12 }}>Pedido</th>
                      <th style={{ textAlign: 'left', padding: '12px 14px', color: C.muted, fontSize: 12 }}>Cliente</th>
                      <th style={{ textAlign: 'left', padding: '12px 14px', color: C.muted, fontSize: 12 }}>Entregador</th>
                      <th style={{ textAlign: 'left', padding: '12px 14px', color: C.muted, fontSize: 12 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 14px', color: C.muted, fontSize: 12 }}>Valor</th>
                      <th style={{ textAlign: 'left', padding: '12px 14px', color: C.muted, fontSize: 12 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id} style={{ borderTop: `1px solid ${C.line}` }}>
                        <td style={{ padding: '12px 14px', color: C.text, fontWeight: 600 }}>{pedido.id}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ color: C.text }}>{pedido.cliente}</div>
                          <div style={{ color: C.muted, fontSize: 12 }}>{pedido.endereco}</div>
                        </td>
                        <td style={{ padding: '12px 14px', color: C.text }}>{pedido.entregador}</td>
                        <td style={{ padding: '12px 14px' }}><Pill status={pedido.status} /></td>
                        <td style={{ padding: '12px 14px', color: C.text }}>{formatCurrency(pedido.valor)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 6, padding: 8, color: C.text }}><Pencil size={14} /></button>
                            <button style={{ background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 6, padding: 8, color: C.text }}><MoreVertical size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 18 }}>
              <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: 18 }}>
                <SectionHeader title="Clientes & entregadores" subtitle="Relacionamento" />
                <div style={{ display: 'grid', gap: 12 }}>
                  {CLIENTES.map((item) => (
                    <div key={item.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, background: C.panelAlt }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.amberDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber }}>
                          {item.tipo === 'Cliente' ? <Users size={15} /> : <UserCog size={15} />}
                        </div>
                        <div>
                          <div style={{ color: C.text, fontWeight: 600 }}>{item.nome}</div>
                          <div style={{ color: C.muted, fontSize: 12 }}>{item.tipo}</div>
                        </div>
                      </div>
                      <div style={{ color: C.muted, fontSize: 12 }}>{item.pedidos} pedidos</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: 18 }}>
                <SectionHeader title="Contato" subtitle="Atendimento" />
                <div style={{ display: 'grid', gap: 12, color: C.text }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Phone size={15} style={{ color: C.amber }} /> (11) 4000-2000</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={15} style={{ color: C.amber }} /> suporte@routedelivery.com</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MapPin size={15} style={{ color: C.amber }} /> São Paulo - SP</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <LoginScreen onLogin={(token, conta) => setSession({ token, conta })} />;
  }

  return <DashboardApp token={session.token} conta={session.conta} />;
}

export default App;
