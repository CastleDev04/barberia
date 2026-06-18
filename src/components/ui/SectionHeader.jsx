export default function SectionHeader({ eyebrow, title, subtitle, centered = false }) {
  return (
    <div className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : ''}`}>
      {eyebrow && (
        <span className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-[#C9A84C] opacity-80">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#F5F1EB] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[#8d877a] text-base leading-relaxed ${centered ? 'max-w-xl' : 'max-w-lg'}`}>
          {subtitle}
        </p>
      )}
      <div className={`gold-divider mt-1 ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
}
