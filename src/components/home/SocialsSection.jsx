import { Instagram, Facebook, MessageCircle, ExternalLink } from 'lucide-react';
import { SOCIALS } from '../../data';

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
};

const colorMap = {
  instagram: 'from-purple-600 to-pink-500',
  facebook: 'from-blue-600 to-blue-500',
  whatsapp: 'from-green-600 to-green-500',
};

export default function SocialsSection() {
  return (
    <section className="py-16 border-t border-[rgba(201,168,76,0.08)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] opacity-70">
              Síguenos
            </span>
            <h3 className="font-display text-2xl font-semibold text-[#F5F1EB] mt-1">
              En redes sociales
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => {
              const Icon = iconMap[social.id];
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center
                      bg-gradient-to-br ${colorMap[social.id]}
                      opacity-70 group-hover:opacity-100
                      transition-all duration-300
                      group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
                      group-hover:-translate-y-1
                    `}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-[#F5F1EB] text-xs font-medium">{social.label}</div>
                      <div className="text-[#6B6357] text-[10px] mt-0.5">{social.handle}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Testimonial snippet */}
          <div className="hidden lg:block bg-[#141210] border border-[rgba(201,168,76,0.1)] rounded-2xl px-5 py-4 max-w-xs">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#C9A84C"><path d="M6 1l1.5 3H11L8.5 6l1 3L6 7.5 2.5 9l1-3L1 4h3.5z"/></svg>
              ))}
            </div>
            <p className="text-[#A89F8C] text-sm leading-relaxed italic">
              "El mejor corte que me han hecho. Los detalles son impecables."
            </p>
            <div className="text-[#6B6357] text-xs mt-2">— Cliente verificado</div>
          </div>
        </div>
      </div>
    </section>
  );
}
