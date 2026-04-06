import { Settings as SettingsIcon, Palette, FileText, ToggleLeft, Database, Download, Upload, Save, Image as ImageIcon, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import * as Constants from '../../constants';
import belemLogo from '../../assets/belem-ti-logo.png';

const Settings: React.FC = () => {
  const {
    isDarkMode,
    lowStockThreshold,
    warrantyTerm,
    enableServices,
    saveSetting,
    showNotification,
    handleExportData,
    handleImportData
  } = useApp();

  const handleSave = async (key: string, value: any) => {
    // In our simplified AppContext, we'd need setters for these
    // For now, let's assume we call saveSetting which handles the API
    await saveSetting(key, String(value));
    showNotification(`Configuração ${key} salva!`);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        handleImportData(data);
      } catch (err) {
        showNotification('Erro ao ler arquivo de backup', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Configurações</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Personalize sua experiência</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Default Logo Section */}
        <div className={cn(
          "p-8 rounded-xl border flex flex-col items-center justify-center space-y-6 md:col-span-2",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="w-48 h-48 relative group">
            <img
              src={belemLogo}
              alt="Logo Belém TI"
              className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Belém TI - Soluções Inteligentes
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Transformando Negócios através da Tecnologia
            </p>
          </div>
        </div>

        {/* System Behavior */}
        <div className={cn(
          "md:col-span-2 p-5 rounded-xl border space-y-6",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <ToggleLeft size={12} /> Comportamento do Sistema
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500">Alerta de Estoque Baixo (Quantidade)</label>
              <input
                type="number"
                defaultValue={lowStockThreshold}
                onBlur={(e) => handleSave('lowStockThreshold', e.target.value)}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none transition-all text-xs",
                  isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              />
            </div>


            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500">Termo de Garantia Padrão</label>
              <textarea
                defaultValue={warrantyTerm}
                onBlur={(e) => handleSave('warrantyTerm', e.target.value)}
                rows={4}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none transition-all text-xs resize-none leading-relaxed",
                  isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              />
            </div>
          </div>
        </div>

        {/* Database & Backup Section */}
        <div className={cn(
          "p-5 rounded-xl border space-y-6 md:col-span-2",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Database size={12} /> Manutenção e Backup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                <Download size={18} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest">Exportar Backup</div>
                <div className="text-[9px] text-slate-500 uppercase font-medium mb-2">Baixar dados em JSON</div>
                <button
                  onClick={handleExportData}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-bold uppercase rounded-md transition-all"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 relative">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                <Upload size={18} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest">Restaurar Dados</div>
                <div className="text-[9px] text-slate-500 uppercase font-medium mb-2">Carregar arquivo JSON</div>
                <label className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer">
                  Importar
                  <input type="file" accept=".json" onChange={onImport} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
