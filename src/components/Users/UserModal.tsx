import React from 'react';
import { X, User, Shield, Lock, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const UserModal: React.FC = () => {
  const {
    isUserModalOpen,
    setIsUserModalOpen,
    isDarkMode,
    editingUser,
    setEditingUser,
    currentUser,
    newUserName,
    setNewUserName,
    newUserUsername,
    setNewUserUsername,
    newUserPassword,
    setNewUserPassword,
    newUserRole,
    setNewUserRole,
    handleSaveUser
  } = useApp();

  if (!isUserModalOpen) return null;

  const handleClose = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserRole('user');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveUser();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className={cn(
            "absolute inset-0 backdrop-blur-sm",
            isDarkMode ? "bg-black/60" : "bg-black/10"
          )}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "relative w-full max-w-md border rounded-3xl shadow-2xl overflow-hidden",
            isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
          )}
        >
          <div className={cn(
            "p-6 border-b flex items-center justify-between",
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <Shield size={24} />
              </div>
              <h2 className="text-xl font-bold">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            </div>
            <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Nome Completo</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                  )}
                  placeholder="Nome do colaborador"
                />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Usuário / Login</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                  )}
                  placeholder="nome.sobrenome"
                />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                  )}
                  placeholder={editingUser ? "•••••••• (deixe em branco para manter)" : "••••••••"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Nível de Acesso</label>
              <div className="flex gap-2">
                {(['admin', 'supervisor', 'user'] as const).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewUserRole(role)}
                    disabled={currentUser?.role === 'supervisor' && role !== 'user'}
                    className={cn(
                      "flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase transition-all",
                      newUserRole === role
                        ? "bg-blue-500/10 border-blue-500 text-blue-500 shadow-sm"
                        : isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-500",
                      (currentUser?.role === 'supervisor' && role !== 'user') && "opacity-30 cursor-not-allowed grayscale"
                    )}
                  >
                    {role === 'admin' ? 'Adm' : role === 'supervisor' ? 'Sup' : 'Op'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "flex-1 px-4 py-3 rounded-2xl font-bold transition-all",
                  isDarkMode ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                )}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20"
              >
                Salvar Usuário
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserModal;
