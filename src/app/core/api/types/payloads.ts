export interface UserLoginPayload {
  user: { login: string; password: string };
}

export interface UserLoginResponsePayload {
  user: { login: string; isLogged: boolean };
}

export interface UserLogoutPayload {
  user: { login: string; password: string };
}

export interface UserLogoutResponsePayload {
  user: { login: string; isLogged: boolean };
}

export interface UserActiveResponsePayload {
  users: { login: string; isLogged: boolean }[];
}

export interface UserInactiveResponsePayload {
  users: { login: string; isLogged: boolean }[];
}

export interface ErrorPayload {
  error: string;
}
