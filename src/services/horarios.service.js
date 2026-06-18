import api from './api';
import { ENDPOINTS } from './endpoints';

export const horariosService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.HORARIOS);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener horarios' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.HORARIO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener horario' 
      };
    }
  },

  create: async (horarioData) => {
    try {
      const response = await api.post(ENDPOINTS.HORARIOS, horarioData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al crear horario' 
      };
    }
  },

  update: async (id, horarioData) => {
    try {
      const response = await api.put(ENDPOINTS.HORARIO_BY_ID(id), horarioData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al actualizar horario' 
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.HORARIO_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al eliminar horario' 
      };
    }
  },
};

// Servicio adicional para obtener barberos disponibles
export const getBarberosDisponibles = async () => {
  try {
    const response = await api.get('/barberos');
    // Filtrar solo barberos activos/disponibles
    const barberosActivos = response.data.filter(
      barbero => barbero.estado === 'Disponible' || barbero.estado === 'ACTIVO'
    );
    return { success: true, data: barberosActivos };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.mensaje || 'Error al obtener barberos' 
    };
  }
};