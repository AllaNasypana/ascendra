'use client';

import {  TextField, PasswordField, SelectField } from '@/components/forms/form-fields';
import { Button } from '@/components/ui';
import { useRegistrationForm } from './useRegistrationForm';
import { ERole } from '@/types';

export const RegistrationForm = () => {
  const { control, handleSubmit, errors, isLoading,  onSubmit } = useRegistrationForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField
                control={control}
                name="name"
                label="FullName"
                autoComplete="name"
                error={errors.name?.message || ''}
            />
            <TextField
                control={control}
                name="email"
                label="Email"
                autoComplete="email"
                error={errors.email?.message || ''}
            />
            <SelectField
                control={control}
                name="role"
                label="Role"
                options={Object.values(ERole).map((role) => ({ label: role, value: role }))}
                error={errors.role?.message || ''}
            />
            <PasswordField
                control={control}
                name="password"
                label="Password"
                autoComplete="current-password"
                error={errors.password?.message || ''}
            />
            <PasswordField
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                autoComplete="current-password"
                error={errors.confirmPassword?.message || ''}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating…" : "Create account"}
            </Button>
          </form>
  );
}