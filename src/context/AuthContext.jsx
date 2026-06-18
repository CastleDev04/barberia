import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [encargado, setEncargado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const encargadoData = localStorage.getItem('encargado');
      
      if (token && encargadoData) {
        try {
          setEncargado(JSON.parse(encargadoData));
        } catch (e) {
          authService.logout();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (correo, password) => {
    const result = await authService.login(correo, password);
    if (result.success) {
      setEncargado(result.data.encargado);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setEncargado(null);
  };

  return (
    <AuthContext.Provider value={{ 
      encargado, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!encargado 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};