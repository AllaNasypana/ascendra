'use client';

import type { InputHTMLAttributes } from 'react';

import { FormFieldWrapper } from './form-field-wrapper';
import { Control, FieldValues, Path } from 'react-hook-form';
import { PasswordInput } from '@/components/ui';

interface IProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  control: Control<T, unknown, FieldValues>;
  label?: string;
  error?: string;
  className?: string;
  name: Path<T>;
}

export function PasswordField<T extends FieldValues>({
  control,
  label,
  error,
  className,
  name,
  ...rest
}: IProps<T>) {
  return (
    <FormFieldWrapper
      name={name}
      control={control}
      label={label}
      error={error}
      className={className}
      render={(field) => (
        <PasswordInput
          isError={!!error}
          id={name}
          autoComplete={name}
          {...field}
          {...rest}
          value={field.value ?? ''}
        />
      )}
    />
  );
}
