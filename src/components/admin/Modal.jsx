export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-[#141210] border border-[rgba(201,168,76,0.08)] rounded-2xl shadow-lg overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.02)]">
          <h3 className="font-display text-lg font-semibold text-[#F5F1EB]">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.02)] bg-[rgba(201,168,76,0.02)]">{footer}</div>
        )}
      </div>
    </div>
  );
}
