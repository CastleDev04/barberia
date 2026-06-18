import api from './api';
import { ENDPOINTS } from './endpoints';

export const encargadosService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.ENCARGADOS);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener encargados' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.ENCARGADO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener encargado' 
      };
    }
  },

  create: async (encargadoData) => {
    try {
      const response = await api.post(ENDPOINTS.ENCARGADOS, encargadoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear encargado' 
      };
    }
  },

  update: async (id, encargadoData) => {
    try {
      const response = await api.put(ENDPOINTS.ENCARGADO_BY_ID(id), encargadoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar encargado' 
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.ENCARGADO_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar encargado' 
      };
    }
  },
};