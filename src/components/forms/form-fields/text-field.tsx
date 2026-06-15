'use client';

import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils';
import { FormFieldWrapper } from './form-field-wrapper';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui';

interface IProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<T, unknown, FieldValues>;
  label?: string;
  error?: string;
  className?: string;

  name: Path<T>;
  type?: string;
}

export function TextField<T extends FieldValues>({
  control,
  label,
  error,
  className,
  name,
  type = 'text',
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
        <Input
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive'
        )}
          id={name}
          type={type}
          autoComplete={name}
          {...field}
          {...rest}
          value={field.value ?? ''}
          onChange={(event) => {
            const value =
              type === "number"
                ? event.target.valueAsNumber
                : event.target.value;

            field.onChange(Number.isNaN(value) ? undefined : value);
          }}
        />
      )}
    />
  );
}
