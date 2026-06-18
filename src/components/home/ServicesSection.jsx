import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../../data';
import { useBooking } from '../../context/BookingContext';
import ServiceCard from '../ui/ServiceCard';
import SectionHeader from '../ui/SectionHeader';

export default function ServicesSection() {
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const handleSelect = (service) => {
    // Pre-selecciona el servicio y navega a reservar
    updateBooking('services', [service]);
    navigate('/reservar');
  };

  return (
    <section id="servicios" className="py-24 relative">
      {/* Section bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0C0A] via-[#0f0e0b] to-[#0D0C0A]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-14">
          <SectionHeader
            eyebrow="Nuestros servicios"
            title="Elige tu experiencia"
            subtitle="Selecciona el servicio que necesitas y reserva tu turno con el barbero de tu preferencia."
            centered
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.1 + 0.1}s`, animationFillMode: 'both' }}
            >
              <ServiceCard
                service={service}
                onClick={() => handleSelect(service)}
                clickable
              />
            </div>
          ))}
        </div>

        <p className="text-center text-[#6B6357] text-sm mt-8">
          Al seleccionar un servicio serás redirigido al formulario de reserva.
        </p>
      </div>
    </section>
  );
}
