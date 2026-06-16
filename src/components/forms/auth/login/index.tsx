'use client';

import { TextField, PasswordField } from '@/components/forms/form-fields';
import { Button } from '@/components/ui';
import { useLoginForm } from './useLogin';

export const LoginForm = () => {
  const { control, handleSubmit, errors, isSubmitting, onSubmit } = useLoginForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField
        control={control}
        name="email"
        label="Email"
        autoComplete="email"
        error={errors.email?.message || ''}
      />
      <PasswordField
        control={control}
        name="password"
        label="Password"
        autoComplete="current-password"
        error={errors.password?.message || ''}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
};
