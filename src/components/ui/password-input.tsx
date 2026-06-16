'use client';

import { useRef, useState, type ComponentProps, type FC } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useClickOutside } from '@/hooks';
import { cn } from '@/utils';

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  isError?: boolean;
}

export const PasswordInput: FC<PasswordInputProps> = ({
  isError = false,
  disabled = false,
  className,
  ...props
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    refElement: rootRef,
    handler: () => setIsHidden(true),
    enabled: !isHidden,
  });

  function toggleVisibility() {
    if (!disabled) {
      setIsHidden((prev) => !prev);
    }
  }

  return (
    <div ref={rootRef} className={cn('password-input', isError && 'form-error', className)}>
      <input
        disabled={disabled}
        type={isHidden ? 'password' : 'text'}
        className="password-input-field"
        {...props}
      />
      <button
        type="button"
        className="password-input-toggle"
        disabled={disabled}
        aria-label={isHidden ? 'Show password' : 'Hide password'}
        onClick={toggleVisibility}
      >
        {isHidden ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
      </button>
    </div>
  );
};
