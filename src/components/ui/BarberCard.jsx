import { Star } from 'lucide-react';

export default function BarberCard({ barber, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        card-premium rounded-2xl p-5 cursor-pointer group
        flex flex-col items-center text-center gap-3
        transition-all duration-300
        ${selected
          ? 'border-[#C9A84C] bg-gradient-to-b from-[rgba(201,168,76,0.08)] to-transparent shadow-[0_0_30px_rgba(201,168,76,0.1)]'
          : 'hover:border-[rgba(201,168,76,0.3)]'
        }
      `}
    >
      {/* Avatar */}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-lg shadow-lg"
        style={{ backgroundColor: barber.color + '33', border: `2px solid ${barber.color}55` }}
      >
        <span style={{ color: barber.color }}>{barber.avatar}</span>
        {selected && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C9A84C] rounded-full flex items-center justify-center">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#0D0C0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h4 className={`font-display font-semibold text-base transition-colors duration-200 ${selected ? 'text-[#C9A84C]' : 'text-[#F5F1EB] group-hover:text-[#C9A84C]'}`}>
          {barber.name}
        </h4>
        <p className="text-[#6B6357] text-xs mt-0.5">{barber.specialty}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 bg-[rgba(201,168,76,0.08)] px-2.5 py-1 rounded-full">
        <Star size={11} className="text-[#C9A84C] fill-[#C9A84C]" />
        <span className="text-[#C9A84C] text-xs font-mono font-medium">{barber.rating}</span>
      </div>
    </div>
  );
}
