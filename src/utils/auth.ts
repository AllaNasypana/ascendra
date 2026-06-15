import bcrypt from "bcryptjs";
import type { User, PublicUser } from "@/types";
import { BCRYPT_SALT_ROUNDS } from "@/constants";

export const hashPassword = (password: string): string =>
  bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);

export const verifyPassword = (password: string, passwordHash: string): boolean =>
  bcrypt.compareSync(password, passwordHash);

export const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _hash, ...publicUser } = user;
  return publicUser;
};
