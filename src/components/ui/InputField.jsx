import { forwardRef } from 'react';

const InputField = forwardRef(({
  label,
  id,
  error,
  hint,
  icon,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#A89F8C] tracking-wide"
        >
          {label}
          {required && <span className="text-[#C9A84C] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6357] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            input-premium
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500 focus:shadow-red-500/20' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-[#6B6357] mt-0.5">{hint}</p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;
