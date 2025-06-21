import { AppUser, User } from '../../user';

export interface UserLoginPayload {
  user: Pick<AppUser, 'login' | 'password'>;
}

export interface UserLoginResponsePayload {
  user: User;
}

export interface UserLogoutPayload {
  user: Pick<AppUser, 'login' | 'password'>;
}

export interface UserLogoutResponsePayload {
  user: User;
}

export interface UserActiveResponsePayload {
  users: User[];
}

export interface UserInactiveResponsePayload {
  users: User[];
}

export interface ErrorPayload {
  error: string;
}
