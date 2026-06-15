'use client';

import { FormFieldWrapper } from './form-field-wrapper';
import { Control, FieldValues, Path } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

interface SelectOption {
  value: string;
  label: string;
}

interface IProps<T extends FieldValues> {
  control: Control<T, unknown, FieldValues>;
  label?: string;
  error?: string;
  className?: string;
  name: Path<T>;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  label,
  error,
  className,
  name,
  options,
  placeholder,
}: IProps<T>) {
  return (
    <FormFieldWrapper
      name={name}
      control={control}
      label={label}
      error={error}
      className={className}
      render={(field) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger
            id={name}
            className={`${!!error && 'form-error'}`}
            aria-label={label ?? name}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
