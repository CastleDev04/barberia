import api from './api';
import { ENDPOINTS } from './endpoints';

export const serviciosService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.SERVICIOS);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener servicios' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.SERVICIO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener servicio' 
      };
    }
  },

  create: async (servicioData) => {
    try {
      const response = await api.post(ENDPOINTS.SERVICIOS, servicioData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear servicio' 
      };
    }
  },

  update: async (id, servicioData) => {
    try {
      const response = await api.put(ENDPOINTS.SERVICIO_BY_ID(id), servicioData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar servicio' 
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.SERVICIO_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar servicio' 
      };
    }
  },
};