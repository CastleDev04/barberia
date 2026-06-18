// ─── Servicios ────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 'corte',
    name: 'Corte de Pelo',
    description: 'Corte clásico o moderno adaptado a tu estilo personal, con acabado perfecto.',
    price: 40000,
    duration: 40,
    icon: '✂️',
  },
  {
    id: 'barba',
    name: 'Barba',
    description: 'Perfilado, afeitado y tratamiento de barba para un look impecable.',
    price: 50000,
    duration: 20,
    icon: '🪒',
  },
  {
    id: 'combo',
    name: 'Corte + Barba',
    description: 'Combo completo: corte de pelo y arreglo de barba con tratamiento premium.',
    price: 80000,
    duration: 60,
    icon: '👑',
    badge: 'Popular',
  },
];

// ─── Barberos ─────────────────────────────────────────────────────────────────
export const BARBERS = [
  {
    id: 'juan',
    name: 'Juan',
    specialty: 'Cortes clásicos',
    rating: 4.9,
    avatar: 'JR',
    color: '#2563eb',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    specialty: 'Barbas & fade',
    rating: 4.8,
    avatar: 'CM',
    color: '#7c3aed',
  },
  {
    id: 'pedro',
    name: 'Pedro',
    specialty: 'Diseños modernos',
    rating: 4.9,
    avatar: 'PG',
    color: '#059669',
  },
  {
    id: 'jorge',
    name: 'Jorge',
    specialty: 'Cortes premium',
    rating: 5.0,
    avatar: 'JL',
    color: '#dc2626',
  },
];

// ─── Horarios disponibles ─────────────────────────────────────────────────────
export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00',
];

// ─── Horarios de atención ─────────────────────────────────────────────────────
export const BUSINESS_HOURS = [
  { day: 'Lunes',     hours: '08:00 – 17:00', open: true },
  { day: 'Martes',    hours: '08:00 – 17:00', open: true },
  { day: 'Miércoles', hours: '08:00 – 17:00', open: true },
  { day: 'Jueves',    hours: '08:00 – 17:00', open: true },
  { day: 'Viernes',   hours: '08:00 – 17:00', open: true },
  { day: 'Sábado',    hours: '08:00 – 12:00', open: true },
  { day: 'Domingo',   hours: 'Cerrado',        open: false },
];

// ─── Redes sociales ───────────────────────────────────────────────────────────
export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', url: '#', handle: '@barberia_premium' },
  { id: 'facebook',  label: 'Facebook',  url: '#', handle: 'Barbería Premium' },
  { id: 'whatsapp',  label: 'WhatsApp',  url: '#', handle: '+595 21 000 000' },
];

// ─── Formatear precio ─────────────────────────────────────────────────────────
export const formatPrice = (price) =>
  new Intl.NumberFormat('es-PY', { style: 'decimal' }).format(price) + ' Gs.';
