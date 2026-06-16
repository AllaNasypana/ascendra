import type { PublicUser } from '@/types';
import type { RegistrationSchema } from '@/lib/schemas';

export type RegisterPayload = Pick<RegistrationSchema, 'name' | 'email' | 'password' | 'role'>;

export interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<PublicUser | null>;
  register: (payload: RegisterPayload) => Promise<PublicUser | null>;
  logout: () => void;
  isLoginPending: boolean;
  isRegisterPending: boolean;
}
