export default function TimeSlot({ time, selected, disabled = false, onClick }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        relative py-2.5 px-3 rounded-lg font-mono text-sm font-medium
        transition-all duration-200 w-full
        ${disabled
          ? 'opacity-40 cursor-not-allowed bg-[rgba(255,255,255,0.02)] text-[#6B6357]'
          : selected
          ? 'bg-[#C9A84C] text-black shadow-[0_4px_16px_rgba(201,168,76,0.3)] scale-[1.02]'
          : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.12)] text-[#A89F8C] hover:border-[rgba(201,168,76,0.4)] hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.06)] cursor-pointer'
        }
      `}
    >
      {time}
      {disabled && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#6B6357] mt-6">
          ocupado
        </span>
      )}
    </button>
  );
}