import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background geometric */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.04)_0%,transparent_70%)]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Corner accent */}
        <div className="absolute top-24 right-0 w-[1px] h-48 bg-gradient-to-b from-transparent via-[rgba(201,168,76,0.4)] to-transparent" />
        <div className="absolute top-0 right-24 w-48 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.4)] to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-[#C9A84C] fill-[#C9A84C]" />
              ))}
            </div>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] opacity-70">
              Barbería Premium · Est. 2015
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6 animate-fade-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            El arte del{' '}
            <span className="italic gold-gradient-text">corte</span>
            {' '}perfecto
          </h1>

          {/* Sub */}
          <p
            className="text-[#8d877a] text-lg leading-relaxed mb-10 animate-fade-up max-w-lg"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            Barbería de alto nivel donde cada detalle importa. Maestros del corte clásico
            y moderno para que siempre luzcas impecable.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <Link to="/reservar">
              <Button
                size="lg"
                iconRight={<ArrowRight size={18} />}
              >
                Reservar turno
              </Button>
            </Link>
            <a href="#servicios">
              <Button size="lg" variant="outline">
                Ver servicios
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex items-center gap-8 mt-12 pt-8 border-t border-[rgba(201,168,76,0.1)] animate-fade-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            {[
              { value: '10+', label: 'Años de experiencia' },
              { value: '4', label: 'Maestros barberos' },
              { value: '5K+', label: 'Clientes satisfechos' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-[#C9A84C]">{stat.value}</div>
                <div className="text-[#6B6357] text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative right side */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 animate-fade-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          {/* Scissor icon large */}
          <div className="w-40 h-40 rounded-full border border-[rgba(201,168,76,0.12)] flex items-center justify-center relative">
            <div className="w-28 h-28 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgba(201,168,76,0.15)] to-transparent flex items-center justify-center">
                <span className="text-4xl">✂️</span>
              </div>
            </div>
            {/* Orbiting dot */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.8)]" />
          </div>
          <div className="font-mono text-xs tracking-[0.3em] uppercase text-[#6B6357] rotate-90 whitespace-nowrap mt-4">
            Premium Barbershop
          </div>
        </div>
      </div>
    </section>
  );
}
