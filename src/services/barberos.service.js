import api from './api';
import { ENDPOINTS } from './endpoints';

export const barberosService = {
  // Obtener todos los barberos
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.BARBEROS);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al obtener barberos' };
    }
  },

  // Obtener un barbero por ID
  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.BARBERO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al obtener barbero' };
    }
  },

  // Crear nuevo barbero
  create: async (barberoData) => {
    try {
      const response = await api.post(ENDPOINTS.BARBEROS, barberoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al crear barbero' };
    }
  },

  // Actualizar barbero
  update: async (id, barberoData) => {
    try {
      const response = await api.put(ENDPOINTS.BARBERO_BY_ID(id), barberoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al actualizar barbero' };
    }
  },

  // Eliminar barbero
  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.BARBERO_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al eliminar barbero' };
    }
  },

  // Cambiar estado del barbero
  updateEstado: async (id, estado) => {
    try {
      const response = await api.patch(ENDPOINTS.BARBERO_ESTADO(id, estado));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al actualizar estado' };
    }
  },
};