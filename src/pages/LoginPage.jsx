import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return; // Prevenir envíos múltiples
    
    setLoading(true);
    setError('');
    
    try {
      const result = await login(correo, password);
      
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.error || 'Credenciales inválidas');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0908] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#141210] border border-[rgba(201,168,76,0.15)] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[#F5F1EB]">Panel de Administración</h1>
          <p className="text-[#6B6357] text-sm mt-2">Ingresa tus credenciales</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Correo"
            id="correo"
            type="email"
            required
            placeholder="encargado@barberia.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={loading}
          />
          
          <InputField
            label="Contraseña"
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  );
}