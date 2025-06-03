import { ErrorPayload, UserLoginResponsePayload, UserLogoutResponsePayload } from './payloads';

interface ApiResponse<T extends string, P> {
  id: string;
  type: T;
  payload: P;
}

export type UserLoginResponse = ApiResponse<'USER_LOGIN', UserLoginResponsePayload>;
export type UserLogoutResponse = ApiResponse<'USER_LOGOUT', UserLogoutResponsePayload>;
export type ErrorResponse = ApiResponse<'ERROR', ErrorPayload>;

export type ChatApiResponse = UserLoginResponse | UserLogoutResponse | ErrorResponse;
