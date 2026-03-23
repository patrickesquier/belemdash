import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import * as Constants from '../../constants';

const Login: React.FC = () => {
  const { 
    setCurrentUser, 
    setToken,
    showNotification, 
    isDarkMode,
    appName,
    distributorColor
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        
        // Update Context
        setToken(token);
        setCurrentUser(user);
        
        // Persist to Local Storage
        localStorage.setItem(Constants.TOKEN_KEY, token);
        localStorage.setItem(Constants.CURRENT_USER_KEY, JSON.stringify(user));
        
        showNotification(`Bem-vindo de volta, ${user.name}!`, 'success');
      } else {
        showNotification(data.error || 'Usuário ou senha incorretos', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showNotification('Erro ao conectar com o servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-6",
      isDarkMode ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
    )}>
      <div className="w-full max-w-md relative">
        <div className={cn(
          "p-8 rounded-2xl border shadow-xl transition-all duration-300",
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-6"
              style={{ backgroundColor: `${distributorColor}15` }}
            >
              <Shield style={{ color: distributorColor }} size={32} />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">{appName}</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Painel de Acesso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Usuário</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all duration-200",
                    isDarkMode 
                      ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" 
                      : "bg-zinc-50 border-zinc-200 focus:border-blue-500 focus:bg-white"
                  )}
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all duration-200",
                    isDarkMode 
                      ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" 
                      : "bg-zinc-50 border-zinc-200 focus:border-blue-500 focus:bg-white"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-md",
                isLoading 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Acessando...
                </>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-500/10 flex justify-center">
             <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                © {new Date().getFullYear()} • {appName}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
