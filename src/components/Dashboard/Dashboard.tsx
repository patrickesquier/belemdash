import React from 'react';
import {
  TrendingUp, DollarSign, Package, Users, AlertCircle,
  ChevronRight, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { stats, isDarkMode, distributorColor, distributorName, setSearchQuery, setActiveTab } = useApp();

  const COLORS = [distributorColor, '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statCards = [
    { label: 'Receita Total', value: `R$ ${stats.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Lucro do Mês', value: `R$ ${stats.monthlyProfit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Produtos em Estoque', value: stats.totalItems, icon: Package, color: 'text-amber-500' },
    { label: 'Base de Clientes', value: stats.totalCustomers, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Visão Geral</h2>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-tight">
            Bem-vindo ao centro de comando da <span className="text-blue-500">{distributorName}</span>.
          </p>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-5 rounded-xl border transition-all duration-300",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6")}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</h3>
            <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sales Chart */}
        <div className={cn(
          "lg:col-span-2 p-8 rounded-3xl border transition-all duration-300",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        )}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Fluxo de Vendas</h3>
              <p className="text-xs text-slate-500 font-medium">Desempenho dos últimos 7 dias</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={distributorColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={distributorColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#27272a' : '#f4f4f5'} vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={distributorColor}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className={cn(
          "p-6 rounded-xl border",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        )}>
          <h3 className="text-sm font-bold uppercase tracking-tight mb-8 text-center text-slate-500">Formas de Pagamento</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.paymentData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  content={({ payload }) => (
                    <div className="flex flex-col gap-2 mt-4">
                      {payload?.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-[11px] font-bold">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-400 uppercase tracking-widest">{entry.value}</span>
                          </div>
                          <span className={isDarkMode ? "text-white" : "text-slate-900"}>
                            {entry.payload.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Low Stock & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className={cn(
          "p-8 rounded-[2rem] border transition-all duration-300",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase tracking-tight">Mais Vendidos</h3>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline"
            >
              Ver Todos
            </button>
          </div>
          <div className="space-y-4">
            {stats.topProducts?.map((product: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5 group hover:bg-slate-500/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-xs font-black text-slate-500">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold uppercase truncate max-w-[200px]">{product.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-blue-500">{product.qty}</span>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          "p-8 rounded-[2rem] border border-red-500/20 transition-all duration-300",
          isDarkMode ? "bg-red-500/[0.03] border-red-500/20" : "bg-red-50 border-red-100 shadow-sm"
        )}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <h3 className="text-lg font-black uppercase tracking-tight text-red-500">Alertas de Estoque</h3>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('inventory');
              }}
              className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
            >
              Ver Todos
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-6">
            Existem <span className="text-red-500 font-black">{stats.lowStock}</span> produtos abaixo do nível de segurança.
          </p>
          <div className="space-y-3">
            {stats.lowStockProducts?.map((product: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-red-500/[0.03] border border-red-500/10 group hover:bg-red-500/[0.06] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Package size={18} className="text-red-500/50" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase truncate max-w-[150px]">{product.name}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{product.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-red-500">{product.quantity}</span>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Restantes</p>
                </div>
              </div>
            ))}
            {stats.lowStock === 0 && (
              <div className="flex items-center justify-center py-10 opacity-20 flex-col gap-2">
                <Package size={40} />
                <span className="text-[10px] font-black uppercase">Tudo em dia com o estoque</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
