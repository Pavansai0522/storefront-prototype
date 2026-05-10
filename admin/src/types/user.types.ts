import type { ID, Nullable } from './utils.types';

export type UserRole = 'superadmin' | 'admin';

export interface JwtPayload {
  userId?: ID;
  email?: string;
  role: UserRole;
  clientId?: Nullable<ID>;
  firstLogin?: boolean;
  isImpersonating?: boolean;
  storeName?: string;
  iat?: number;
}
