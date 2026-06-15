'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/lib/schemas';
import { useAuth } from '@/hooks';

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

export const useLoginForm = () => {
  const { login, isLoginPending } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginSchema>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (data: LoginSchema) => {
    if (!isValid || isSubmitting || isLoginPending) return;
    login(data.email, data.password);
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting: isSubmitting || isLoginPending,
    isValid,
    onSubmit,
  };
};
