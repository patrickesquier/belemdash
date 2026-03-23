import React from 'react';
import { Plus, Search, Edit3, Trash2, Shield, User, Key, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import UserModal from './UserModal';

const Users: React.FC = () => {
  const {
    users,
    isDarkMode,
    setIsUserModalOpen,
    setEditingUser,
    handleDeleteUser,
    currentUser,
    setNewUserName,
    setNewUserUsername,
    setNewUserRole,
    searchQuery,
    setSearchQuery
  } = useApp();

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'supervisor': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserUsername(user.username);
    setNewUserRole(user.role);
    setIsUserModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="group flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Gestão de Equipe</h2>
          <p className="text-xs text-zinc-500 font-medium">Controle de acesso e colaboradores</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-2xl border outline-none transition-all text-sm font-medium",
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white"
                  : "bg-white border-zinc-200 focus:border-blue-500 shadow-sm"
              )}
            />
          </div>

          <button
            onClick={() => {
              setEditingUser(null);
              setNewUserName('');
              setNewUserUsername('');
              setNewUserRole('user');
              setIsUserModalOpen(true);
            }}
            disabled={currentUser?.role === 'user'}
            className={cn(
              "p-3 md:px-6 rounded-2xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-blue-500/20",
              isDarkMode ? "text-black" : "text-white",
              currentUser?.role === 'user' && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <Plus size={20} />
            <span className="hidden md:inline">Novo Colaborador</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-3xl border transition-all relative overflow-hidden group",
              isDarkMode ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/30" : "bg-white border-zinc-200 hover:border-blue-500/30 shadow-sm"
            )}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Shield size={120} />
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black",
                  isDarkMode ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"
                )}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase">Você</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">@{user.username}</div>
                </div>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase border",
                getRoleBadge(user.role)
              )}>
                {user.role}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-end gap-1 relative z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(user)}
                  disabled={currentUser?.role === 'user' && user.id !== currentUser?.id}
                  className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors disabled:opacity-30"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.id === currentUser?.id || currentUser?.role !== 'admin'}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
          </motion.div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-500 italic">Nenhum colaborador encontrado.</div>
        )}
      </div>

      <UserModal />
    </div>
  );
};

export default Users;
