import api from './api';
import { ENDPOINTS } from './endpoints';

export const gastosService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.GASTOS);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener gastos' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.GASTO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener gasto' 
      };
    }
  },

  create: async (gastoData) => {
    try {
      const response = await api.post(ENDPOINTS.GASTOS, gastoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear gasto' 
      };
    }
  },

  update: async (id, gastoData) => {
    try {
      const response = await api.put(ENDPOINTS.GASTO_BY_ID(id), gastoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar gasto' 
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.GASTO_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar gasto' 
      };
    }
  },
};