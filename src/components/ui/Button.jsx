import { forwardRef } from 'react';

const variants = {
  primary: `
    bg-gradient-to-r from-[#C9A84C] to-[#B8941E]
    text-obsidian-950 font-semibold
    hover:from-[#E8C96A] hover:to-[#C9A84C]
    shadow-[0_4px_20px_rgba(201,168,76,0.25)]
    hover:shadow-[0_6px_28px_rgba(201,168,76,0.4)]
    active:scale-[0.98]
  `,
  outline: `
    bg-transparent border border-[rgba(201,168,76,0.3)]
    text-[#C9A84C] font-medium
    hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.06)]
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent text-[#A89F8C] font-medium
    hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.06)]
    active:scale-[0.98]
  `,
  danger: `
    bg-red-900/30 border border-red-800/50 text-red-400
    hover:bg-red-900/50 hover:border-red-700
    active:scale-[0.98]
  `,
};

const sizes = {
  sm:  'px-4 py-2 text-sm rounded-lg',
  md:  'px-6 py-3 text-base rounded-xl',
  lg:  'px-8 py-4 text-lg rounded-xl',
  xl:  'px-10 py-5 text-xl rounded-2xl',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-body transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
