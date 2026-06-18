import { CalendarDays, Clock, User, Scissors, Mail, Phone } from 'lucide-react';

const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DAYS_FULL = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function formatPrice(price) {
  if (!price && price !== 0) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function Row({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0">
      <span className="text-[#C9A84C] mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[#6B6357] text-xs mb-0.5">{label}</div>
        <div className="text-[#F5F1EB] text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

// Función para corregir fecha (suma 1 día)
const corregirFechaMostrada = (fecha) => {
  if (!fecha) return null;
  // Si es string, convertirlo a Date
  let fechaObj = fecha;
  if (typeof fecha === 'string') {
    const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
    fechaObj = new Date(year, month - 1, day);
  }
  const nuevaFecha = new Date(fechaObj);
  nuevaFecha.setDate(nuevaFecha.getDate() + 1);
  return nuevaFecha;
};

// Función para corregir hora (suma 1 hora)
const corregirHoraMostrada = (hora) => {
  if (!hora) return null;
  const [hour, minute] = hora.split(':').map(Number);
  let nuevaHora = hour + 1;
  if (nuevaHora >= 24) nuevaHora = nuevaHora - 24;
  return `${String(nuevaHora).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export default function BookingSummary({ booking }) {
  // Validación: si booking no existe, mostrar carga
  if (!booking) {
    return (
      <div className="bg-[#141210] border border-[rgba(201,168,76,0.15)] rounded-2xl overflow-hidden">
        <div className="px-5 py-8 text-center text-[#6B6357]">
          Cargando resumen...
        </div>
      </div>
    );
  }

  const { services = [], barber, date, time, client = {} } = booking;

  // Fecha formateada y corregida
  let formattedDate = null;
  if (date) {
    const fechaCorregida = corregirFechaMostrada(date);
    if (fechaCorregida) {
      formattedDate = `${DAYS_FULL[fechaCorregida.getDay()]}, ${fechaCorregida.getDate()} de ${MONTHS_SHORT[fechaCorregida.getMonth()]} ${fechaCorregida.getFullYear()}`;
    }
  }

  // Hora corregida
  const horaMostrada = time ? corregirHoraMostrada(time) : null;

  const clientName = client.firstName || client.lastName
    ? `${client.firstName || ''} ${client.lastName || ''}`.trim()
    : null;

  const totalPrice = services.reduce((acc, s) => acc + (parseFloat(s.precio) || parseFloat(s.price) || 0), 0);
  const totalDuration = services.reduce((acc, s) => acc + (s.duracion || s.duration || 0), 0);

  return (
    <div className="bg-[#141210] border border-[rgba(201,168,76,0.15)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[rgba(201,168,76,0.1)] to-transparent px-5 py-4 border-b border-[rgba(201,168,76,0.1)]">
        <h3 className="font-display font-semibold text-[#F5F1EB]">Resumen de reserva</h3>
        <p className="text-[#6B6357] text-xs mt-0.5">Revisa los detalles antes de confirmar</p>
      </div>

      {/* Rows */}
      <div className="px-5 py-2">
        {services.length > 0 && (
          <div className="flex items-start gap-3 py-3 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[#C9A84C] mt-0.5 flex-shrink-0"><Scissors size={15} /></span>
            <div className="flex-1 min-w-0">
              <div className="text-[#6B6357] text-xs mb-0.5">Servicios</div>
              <div className="text-[#F5F1EB] text-sm font-medium">
                <div className="space-y-1">
                  {services.map((s, idx) => (
                    <div key={s.id_servicio || s.id || idx} className="truncate">
                      {s.nombre_servicio || s.name} — {formatPrice(s.precio || s.price)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Row
          icon={<User size={15} />}
          label="Barbero"
          value={barber ? (barber.nombres ? `${barber.nombres} ${barber.apellido || ''}` : barber.name) : null}
        />
        
        <Row
          icon={<CalendarDays size={15} />}
          label="Fecha"
          value={formattedDate}
        />
        
        <Row
          icon={<Clock size={15} />}
          label="Hora"
          value={horaMostrada}
        />
        
        <Row
          icon={<User size={15} />}
          label="Cliente"
          value={clientName}
        />
        
        <Row
          icon={<Mail size={15} />}
          label="Correo"
          value={client.email || null}
        />
        
        <Row
          icon={<Phone size={15} />}
          label="Teléfono"
          value={client.phone || null}
        />
      </div>

      {/* Total */}
      {services.length > 0 && (
        <div className="px-5 py-4 bg-[rgba(201,168,76,0.05)] border-t border-[rgba(201,168,76,0.1)]">
          <div className="flex items-center justify-between">
            <span className="text-[#A89F8C] text-sm">Total</span>
            <span className="font-display text-xl font-semibold text-[#C9A84C]">
              {formatPrice(totalPrice)}
            </span>
          </div>
          {totalDuration > 0 && (
            <div className="text-[#6B6357] text-xs mt-1 text-right">
              Duración aprox. {totalDuration} min
            </div>
          )}
        </div>
      )}
    </div>
  );
}