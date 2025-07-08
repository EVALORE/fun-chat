import {
  ErrorPayload,
  MessageFetchResponsePayload,
  MessageSendResponsePayload,
  UserActiveResponsePayload,
  UserExternalLoginResponsePayload,
  UserInactiveResponsePayload,
  UserLoginResponsePayload,
  UserLogoutResponsePayload,
} from './payloads';

interface ApiResponse<T extends string, P> {
  id: string;
  type: T;
  payload: P;
}

export type UserLoginResponse = ApiResponse<'USER_LOGIN', UserLoginResponsePayload>;
export type UserLogoutResponse = ApiResponse<'USER_LOGOUT', UserLogoutResponsePayload>;
export type UserActiveResponse = ApiResponse<'USER_ACTIVE', UserActiveResponsePayload>;
export type UserInactiveResponse = ApiResponse<'USER_INACTIVE', UserInactiveResponsePayload>;
export type MessageSendResponse = ApiResponse<'MSG_SEND', MessageSendResponsePayload>;
export type MessageFetchResponse = ApiResponse<'MSG_FROM_USER', MessageFetchResponsePayload>;
export type UserExternalLoginResponse = ApiResponse<
  'USER_EXTERNAL_LOGIN',
  UserExternalLoginResponsePayload
>;
export type ErrorResponse = ApiResponse<'ERROR', ErrorPayload>;

export type ChatApiResponse =
  | UserLoginResponse
  | UserLogoutResponse
  | UserActiveResponse
  | UserInactiveResponse
  | MessageSendResponse
  | MessageFetchResponse
  | UserExternalLoginResponse
  | ErrorResponse;
