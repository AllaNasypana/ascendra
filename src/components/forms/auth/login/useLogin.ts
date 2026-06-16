'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginSchema } from '@/lib/schemas';
import { useAuth } from '@/hooks';
import { getRoleRedirectPath } from '@/utils';

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

export const useLoginForm = () => {
  const router = useRouter();
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

  const onSubmit = async (data: LoginSchema) => {
    if (isSubmitting || isLoginPending) return;

    const user = await login(data.email, data.password);

    if (!user) return;

    router.replace(getRoleRedirectPath(user.role));
    router.refresh();
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
