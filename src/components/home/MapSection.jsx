import { MapPin, Clock, Phone } from 'lucide-react';
import { BUSINESS_HOURS } from '../../data';
import SectionHeader from '../ui/SectionHeader';

export default function MapSection() {
  const today = new Date().toLocaleDateString('es-PY', { weekday: 'long' });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <section id="ubicacion" className="py-24 bg-[#0A0908]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Map + Contact */}
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Dónde encontrarnos"
              title="Nuestra ubicación"
              subtitle="Estamos en el corazón de la ciudad, fácil acceso y estacionamiento disponible."
            />

            {/* Map placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.12)] h-64 group">
              {/* Styled placeholder map */}
              <div className="absolute inset-0 bg-[#141210]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px',
                }}
              />
              {/* Roads */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-[rgba(201,168,76,0.12)]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-[1px] bg-[rgba(201,168,76,0.12)]" />
              </div>
              {/* Pin */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[rgba(201,168,76,0.2)] animate-ping scale-150" />
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8A6A1F] flex items-center justify-center shadow-[0_4px_20px_rgba(201,168,76,0.4)]">
                    <MapPin size={18} className="text-black" />
                  </div>
                </div>
              </div>
              {/* Label */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-[rgba(13,12,10,0.9)] border border-[rgba(201,168,76,0.2)] rounded-xl px-4 py-2 flex items-center gap-2">
                  <MapPin size={14} className="text-[#C9A84C]" />
                  <span className="text-[#F5F1EB] text-sm font-medium">Av. Principal 1234, Asunción</span>
                </div>
              </div>
              {/* Hover open maps */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center bg-[rgba(13,12,10,0.5)] backdrop-blur-sm"
              >
                <span className="bg-[#C9A84C] text-black text-sm font-semibold px-4 py-2 rounded-xl">
                  Abrir en Maps →
                </span>
              </a>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              {[
                { icon: <MapPin size={16} />, text: 'Av. Principal 1234, Asunción, Paraguay' },
                { icon: <Phone size={16} />, text: '+595 21 000 000' },
                { icon: <Clock size={16} />, text: 'Lun–Vie 08:00–17:00 · Sáb 08:00–12:00' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-[#8d877a] text-sm">
                  <span className="text-[#C9A84C] flex-shrink-0">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Business Hours */}
          <div className="bg-[#141210] border border-[rgba(201,168,76,0.1)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                <Clock size={16} className="text-[#C9A84C]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#F5F1EB]">Horarios de Atención</h3>
            </div>

            <div className="flex flex-col gap-2">
              {BUSINESS_HOURS.map((item) => {
                const isToday = todayCapitalized.startsWith(item.day.slice(0, 3));
                return (
                  <div
                    key={item.day}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-150 ${
                      isToday
                        ? 'bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)]'
                        : 'hover:bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />}
                      <span className={`text-sm font-medium ${isToday ? 'text-[#C9A84C]' : 'text-[#A89F8C]'}`}>
                        {item.day}
                        {isToday && <span className="ml-2 text-xs opacity-60">(Hoy)</span>}
                      </span>
                    </div>
                    <span className={`font-mono text-sm ${item.open ? (isToday ? 'text-[#C9A84C]' : 'text-[#8d877a]') : 'text-[#4a4540] line-through'}`}>
                      {item.hours}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
