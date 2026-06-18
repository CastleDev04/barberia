import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Jullo','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar({ selected, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (day) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year
    );
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isPast = (day) => {
    const d = new Date(year, month, day);
    return d < today;
  };

  const isSunday = (day) => {
    return new Date(year, month, day).getDay() === 0;
  };

  const handleSelect = (day) => {
    if (isPast(day) || isSunday(day)) return;
    onSelect(new Date(year, month, day));
  };

  // Prevent navigating before current month
  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  // Build cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-[#141210] border border-[rgba(201,168,76,0.1)] rounded-2xl p-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A89F8C] hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-center">
          <div className="font-display font-semibold text-[#F5F1EB]">
            {MONTHS[month]}
          </div>
          <div className="font-mono text-xs text-[#6B6357]">{year}</div>
        </div>

        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A89F8C] hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] transition-colors duration-150"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-mono font-medium text-[#6B6357] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const past = isPast(day);
          const sunday = isSunday(day);
          const disabled = past || sunday;
          const sel = isSelected(day);
          const tod = isToday(day);

          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={`
                h-9 w-full flex items-center justify-center rounded-lg text-sm font-medium
                transition-all duration-150
                ${disabled
                  ? 'text-[#3a3530] cursor-not-allowed'
                  : sel
                  ? 'bg-[#C9A84C] text-black shadow-[0_2px_12px_rgba(201,168,76,0.3)]'
                  : tod
                  ? 'border border-[rgba(201,168,76,0.4)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)]'
                  : 'text-[#A89F8C] hover:bg-[rgba(201,168,76,0.06)] hover:text-[#F5F1EB] cursor-pointer'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-1.5 text-[10px] text-[#6B6357]">
          <div className="w-3 h-3 rounded-sm bg-[#C9A84C]" />
          Seleccionado
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#6B6357]">
          <div className="w-3 h-3 rounded-sm border border-[rgba(201,168,76,0.4)]" />
          Hoy
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#6B6357]">
          <div className="w-3 h-3 rounded-sm bg-[rgba(255,255,255,0.03)]" />
          No disponible
        </div>
      </div>
    </div>
  );
}
