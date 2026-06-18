export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Barberos
  BARBEROS: '/barberos',
  BARBERO_BY_ID: (id) => `/barberos/${id}`,
  //BARBERO_ESTADO: (id, estado) => `/barberos/${id}/estado/${estado}`,
  
  // Clientes
  CLIENTES: '/clientes',
  CLIENTE_BY_ID: (id) => `/clientes/${id}`,
  
  // Encargados
  ENCARGADOS: '/encargados',
  ENCARGADO_BY_ID: (id) => `/encargados/${id}`,
  
  // Servicios
  SERVICIOS: '/servicios',
  SERVICIO_BY_ID: (id) => `/servicios/${id}`,
  
  // Turnos
  TURNOS: '/turnos',
  TURNO_BY_ID: (id) => `/turnos/${id}`,
  //TURNOS_BY_FECHA: (fecha) => `/turnos?fecha=${fecha}`,
  //TURNOS_BY_BARBERO: (id) => `/turnos/barbero/${id}`,
  //TURNOS_ESTADO: (id, estado) => `/turnos/${id}/estado/${estado}`,
    TURNO_CANCELAR: (id) => `/turnos/cancelar/${id}`,
  TURNO_UPDATE_ESTADO: (id) => `/turnos/${id}/estado`, 
  
  // Pagos
  PAGOS: '/pagos',
  PAGO_BY_ID: (id) => `/pagos/${id}`,
  //PAGOS_BY_TURNO: (id) => `/pagos/turno/${id}`,
  
  // Gastos
  GASTOS: '/gastos',
  GASTO_BY_ID: (id) => `/gastos/${id}`,
  //GASTOS_BY_FECHA: (fecha) => `/gastos?fecha=${fecha}`,
  
  // Horarios
  HORARIOS: '/horarios',
  HORARIO_BY_ID: (id) => `/horarios/${id}`,
  //HORARIOS_BY_BARBERO: (id) => `/horarios/barbero/${id}`,
  
BOOKING_RESERVAS: '/booking/reservas',
  BOOKING_CLIENTES_BUSCAR: '/booking/clientes/buscar',
  BOOKING_DISPONIBILIDAD: '/booking/disponibilidad',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_REPORTES: '/dashboard/reportes',
};