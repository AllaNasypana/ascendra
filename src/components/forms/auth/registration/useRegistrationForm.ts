'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationSchema } from '@/lib/schemas';
import { ERole } from '@/types';
import { useAuth } from '@/hooks';

const DEFAULT_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ERole.ENGINEER,
};

export const useRegistrationForm = () => {
  const { register, isRegisterPending } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegistrationSchema>({
    mode: 'onTouched',
    resolver: zodResolver(registrationSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (data: RegistrationSchema) => {
    if (!isValid || isRegisterPending) return;
    register({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  return {
    control,
    handleSubmit,
    errors,
    isLoading: isRegisterPending || isSubmitting,
    isValid,
    onSubmit,
  };
};
