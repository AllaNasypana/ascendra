import type { User } from '@/types';
import { ERole, UserRole } from '@/types';
import { getStore } from '@/mocks/store';
import { ROUTES } from '@/constants/routes';

export const getUserById = (id: string): User | undefined => getStore().usersMap.get(id);

export const getUserByEmail = (email: string): User | undefined =>
  getStore().usersByEmailMap.get(email);

export const listUsers = (): User[] => getStore().users;

export const createUser = (user: User): User => {
  const store = getStore();
  store.users.push(user);
  store.usersMap.set(user.id, user);
  store.usersByEmailMap.set(user.email, user);
  return user;
};

export const getRoleRedirectPath = (role: UserRole) => {
  return role === ERole.ADMIN ? ROUTES.overview : ROUTES.machines;
};
