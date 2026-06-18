import { CheckCircle2 } from 'lucide-react';

function formatPrice(price) {
  if (!price && price !== 0) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

const corregirFechaMostrada = (fecha) => {
  if (!fecha) return null;
  let fechaObj = fecha;
  if (typeof fecha === 'string') {
    const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
    fechaObj = new Date(year, month - 1, day);
  }
  const nuevaFecha = new Date(fechaObj);
  nuevaFecha.setDate(nuevaFecha.getDate() + 1);
  return nuevaFecha;
};

const corregirHoraMostrada = (hora) => {
  if (!hora) return null;
  const [hour, minute] = hora.split(':').map(Number);
  let nuevaHora = hour + 1;
  if (nuevaHora >= 24) nuevaHora = nuevaHora - 24;
  return `${String(nuevaHora).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export default function ConfirmationScreen({ booking, onReset, bookingJSON }) {
  const { services = [], barber, date, time } = booking;

  let formattedDate = null;
  if (date) {
    const fechaCorregida = corregirFechaMostrada(date);
    if (fechaCorregida) {
      formattedDate = fechaCorregida.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  const horaMostrada = time ? corregirHoraMostrada(time) : null;
  const totalPrice = services.reduce((acc, s) => acc + (parseFloat(s.precio) || parseFloat(s.price) || 0), 0);

  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-[#C9A84C]/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#C9A84C]" />
        </div>
      </div>
      
      <h1 className="font-display text-2xl font-bold text-[#F5F1EB] mb-2">
        ¡Reserva confirmada!
      </h1>
      <p className="text-[#A89F8C] mb-8">
        Te hemos enviado un correo con los detalles de tu cita.
      </p>

      <div className="bg-[#141210] border border-[rgba(201,168,76,0.15)] rounded-2xl p-6 text-left mb-8">
        <h3 className="font-display font-semibold text-[#C9A84C] mb-4">Detalles de la reserva</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-[#6B6357] text-xs">Servicios</p>
            <p className="text-[#F5F1EB]">
              {services.map(s => s.nombre_servicio || s.name).join(', ')}
            </p>
          </div>
          
          <div>
            <p className="text-[#6B6357] text-xs">Barbero</p>
            <p className="text-[#F5F1EB]">{barber?.nombres || barber?.name}</p>
          </div>
          
          <div>
            <p className="text-[#6B6357] text-xs">Fecha y hora</p>
            <p className="text-[#F5F1EB]">{formattedDate} - {horaMostrada}</p>
          </div>
          
          <div>
            <p className="text-[#6B6357] text-xs">Total</p>
            <p className="text-[#C9A84C] font-bold text-xl">{formatPrice(totalPrice)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="px-6 py-3 bg-[#C9A84C] text-black font-medium rounded-lg hover:bg-[#B8982E] transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );
}