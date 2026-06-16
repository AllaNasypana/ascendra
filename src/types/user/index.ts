export const ERole = {
  ENGINEER: 'engineer',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ERole)[keyof typeof ERole];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  vmCount: number;
  runningVmCount: number;
  totalHourlyCost: number;
}
