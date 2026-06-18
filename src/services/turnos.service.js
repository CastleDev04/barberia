import api from './api';
import { ENDPOINTS } from './endpoints';

export const turnosService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.TURNOS);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener turnos' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.TURNO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener turno' 
      };
    }
  },

  create: async (turnoData) => {
    try {
      const response = await api.post(ENDPOINTS.TURNOS, turnoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al crear turno' 
      };
    }
  },

  cancel: async (id) => {
    try {
      const response = await api.patch(ENDPOINTS.TURNO_CANCELAR(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al cancelar turno' 
      };
    }
  },

  
  updateEstado: async (id, estado) => {
    try {
      const response = await api.patch(ENDPOINTS.TURNO_UPDATE_ESTADO(id), { estado });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al actualizar estado' 
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.TURNO_BY_ID(id));
      return { success: true };
    } catch (error) {
      console.log(error)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al eliminar turno' 
      };
    }
  },
};

// Servicios adicionales
export const getClientesDisponibles = async () => {
  try {
    const response = await api.get('/clientes');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.mensaje || 'Error al obtener clientes' 
    };
  }
};

export const getBarberosDisponibles = async () => {
  try {
    const response = await api.get('/barberos');
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

export const getServiciosDisponibles = async () => {
  try {
    const response = await api.get('/servicios');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.mensaje || 'Error al obtener servicios' 
    };
  }
};