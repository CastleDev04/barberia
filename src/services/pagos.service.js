import api from './api';
import { ENDPOINTS } from './endpoints';

export const pagosService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.PAGOS);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener pagos' 
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.PAGO_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener pago' 
      };
    }
  },

  create: async (pagoData) => {
    try {
      const response = await api.post(ENDPOINTS.PAGOS, pagoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al crear pago' 
      };
    }
  },

  update: async (id, pagoData) => {
    try {
      const response = await api.put(ENDPOINTS.PAGO_BY_ID(id), pagoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al actualizar pago' 
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(ENDPOINTS.PAGO_BY_ID(id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al eliminar pago' 
      };
    }
  },
};

// Servicio para obtener turnos con su monto total
export const getTurnosParaPago = async () => {
  try {
    const response = await api.get('/turnos');
    // Calcular monto total de cada turno basado en sus servicios
    const turnosConMonto = response.data.map(turno => {
      let montoTotal = 0;
      if (turno.detalle_turno && turno.detalle_turno.length > 0) {
        montoTotal = turno.detalle_turno.reduce((sum, detalle) => {
          return sum + parseFloat(detalle.precio_servicio || 0);
        }, 0);
      }
      return {
        ...turno,
        monto_total: montoTotal
      };
    });
    // Filtrar turnos completados
    const turnosCompletados = turnosConMonto.filter(
      turno => turno.estado === 'COMPLETADO'
    );
    return { success: true, data: turnosCompletados };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.mensaje || 'Error al obtener turnos' 
    };
  }
};