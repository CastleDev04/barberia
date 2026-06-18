import api from './api';

// Función para generar todos los horarios de 7:00 a 19:00 cada 30 min
function generarHorariosDelDia() {
  const horarios = [];
  const horaInicio = 7;  // 7:00 AM
  const horaFin = 19;    // 7:00 PM
  
  for (let hora = horaInicio; hora <= horaFin; hora++) {
    for (let minuto of [0, 30]) {
      // No incluir 19:30 ya que termina a las 19:00
      if (hora === horaFin && minuto === 30) continue;
      
      const horaStr = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
      horarios.push(horaStr);
    }
  }
  
  return horarios;
}

export const bookingService = {
  getHorariosDisponibles: async (barberoId, fecha) => {
    try {
      console.log(`🔍 Buscando horarios para barbero ${barberoId} en fecha ${fecha}`);
      
      // 1. Generar todos los horarios posibles
      const todosHorarios = generarHorariosDelDia();
      
      // 2. Obtener las citas existentes para ese barbero y fecha
      const response = await api.get(`/turnos/disponibilidad?barberoId=${barberoId}&fecha=${fecha}`);
      
      // 3. Obtener los horarios ocupados
      const horariosOcupados = response.data.data || [];
      
      // 4. Marcar cada horario como disponible o no
      const horariosDisponibles = todosHorarios.map(horario => ({
        hora: horario,
        disponible: !horariosOcupados.includes(horario)
      }));
      
      return {
        success: true,
        data: horariosDisponibles
      };
      
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      return { 
        success: false, 
        data: [], 
        error: error.response?.data?.mensaje || 'Error al obtener horarios'
      };
    }
  },
  
  crearReserva: async (reservaData) => {
    try {
      console.log('📤 Enviando reserva:', reservaData);
      const response = await api.post('/booking/reservas', reservaData);
      console.log('✅ Respuesta:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error en crearReserva:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al crear reserva' 
      };
    }
  },
  
  buscarCliente: async (email, telefono) => {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (telefono) params.append('telefono', telefono);
      const response = await api.get(`/booking/clientes/buscar?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en buscarCliente:', error);
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al buscar cliente' 
      };
    }
  },
  
  getServicios: async () => {
    try {
      const response = await api.get('/servicios');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener servicios' 
      };
    }
  },
  
  getBarberos: async () => {
    try {
      const response = await api.get('/barberos');
      const barberosActivos = response.data.filter(
        b => b.estado === 'Disponible' || b.estado === 'ACTIVO'
      );
      return { success: true, data: barberosActivos };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener barberos' 
      };
    }
  }
};