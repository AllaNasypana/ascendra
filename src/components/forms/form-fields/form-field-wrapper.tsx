'use client';

import type { JSXElementConstructor, ReactElement } from 'react';
import { Control, Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T, unknown, FieldValues>;
  label?: string;
  error?: string;
  className?: string;
  render: (field: ControllerRenderProps<T, Path<T>>) => ReactElement<JSXElementConstructor<any>>;
}

export function FormFieldWrapper<T extends FieldValues>({
  name,
  control,
  label,
  error,
  className,
  render  
}: FormFieldProps<T>) {
  return (
    <div className={`flex flex-col w-full pb-6 relative ${className ?? ''}`}>
      {label && <Label className='mb-2' htmlFor={name}>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => render(field)}
      />

      {error && (
        <p className="form-error absolute bottom-1 left-0">{error}</p>
      )}
    </div>
  );
}
