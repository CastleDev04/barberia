import api from './api';
import { ENDPOINTS } from './endpoints';

export const clientesService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.CLIENTES);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al obtener clientes' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.CLIENTE_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al obtener cliente' };
    }
  },

  create: async (clienteData) => {
    try {
      const response = await api.post(ENDPOINTS.CLIENTES, clienteData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al crear cliente' };
    }
  },

  update: async (id, clienteData) => {
    try {
      const response = await api.put(ENDPOINTS.CLIENTE_BY_ID(id), clienteData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al actualizar cliente' };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.CLIENTE_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al eliminar cliente' };
    }
  },
};