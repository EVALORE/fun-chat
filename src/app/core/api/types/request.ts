import { UserLoginPayload, UserLogoutPayload } from './payloads';

export interface ApiRequest<T extends string, P> {
  id: string;
  type: T;
  payload: P;
}

export type UserLoginRequest = ApiRequest<'USER_LOGIN', UserLoginPayload>;
export type UserLogoutRequest = ApiRequest<'USER_LOGOUT', UserLogoutPayload>;

export type ChatApiRequest = UserLoginRequest | UserLogoutRequest;
