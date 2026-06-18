import { Clock, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../data';

export default function ServiceCard({ service, selected, onClick, clickable = true }) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        card-premium rounded-2xl p-6 group
        ${clickable ? 'cursor-pointer' : ''}
        ${selected
          ? 'border-[#C9A84C] bg-gradient-to-b from-[rgba(201,168,76,0.08)] to-[rgba(201,168,76,0.02)] shadow-[0_0_40px_rgba(201,168,76,0.12)]'
          : ''
        }
        transition-all duration-300
      `}
    >
      {/* Badge */}
      {service.badge && (
        <div className="inline-flex items-center gap-1 bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-xs font-semibold px-2.5 py-1 rounded-full mb-3 font-mono tracking-wider">
          ★ {service.badge}
        </div>
      )}

      {/* Icon */}
      <div className="text-3xl mb-3">{service.icon}</div>

      {/* Name */}
      <h3 className="font-display text-xl font-semibold text-[#F5F1EB] mb-2 group-hover:text-[#C9A84C] transition-colors duration-200">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-[#8d877a] text-sm leading-relaxed mb-5">
        {service.description}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[#C9A84C] font-display font-semibold text-lg">
            {formatPrice(service.price)}
          </span>
          <div className="flex items-center gap-1.5 text-[#6B6357] text-xs">
            <Clock size={12} />
            <span>{service.duration} min</span>
          </div>
        </div>

        {clickable && (
          <div className={`
            w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-300
            ${selected
              ? 'bg-[#C9A84C] text-black'
              : 'bg-[rgba(201,168,76,0.1)] text-[#C9A84C] group-hover:bg-[rgba(201,168,76,0.2)]'
            }
          `}>
            <ChevronRight size={16} />
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.2)]">
          <div className="flex items-center gap-2 text-[#C9A84C] text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            Seleccionado
          </div>
        </div>
      )}
    </div>
  );
}
