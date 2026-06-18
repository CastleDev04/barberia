import api from './api';

export const authService = {
  login: async (correo, password) => {
    try {
      const response = await api.post('/auth/login', { correo, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('encargado', JSON.stringify(response.data.encargado));
      }
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error login:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al iniciar sesión' 
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('encargado');
    // No redirigir aquí, solo limpiar
  },
  
  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};