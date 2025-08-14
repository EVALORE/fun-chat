import {
  ErrorPayload,
  MessageDeliverResponsePayload,
  MessageFetchResponsePayload,
  MessageReadResponsePayload,
  MessageSendResponsePayload,
  UserExternalLoginResponsePayload,
  UserListResponsePayload,
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
export type UserListResponse = ApiResponse<'USER_LIST', UserListResponsePayload>;
export type MessageSendResponse = ApiResponse<'MSG_SEND', MessageSendResponsePayload>;
export type MessageFetchResponse = ApiResponse<'MSG_FROM_USER', MessageFetchResponsePayload>;
export type UserExternalLoginResponse = ApiResponse<
  'USER_EXTERNAL_LOGIN',
  UserExternalLoginResponsePayload
>;
export type MessageDeliverResponse = ApiResponse<'MSG_DELIVER', MessageDeliverResponsePayload>;
export type MessageReadResponse = ApiResponse<'MSG_READ', MessageReadResponsePayload>;
export type ErrorResponse = ApiResponse<'ERROR', ErrorPayload>;

export type ChatApiResponse =
  | UserLoginResponse
  | UserLogoutResponse
  | UserListResponse
  | MessageSendResponse
  | MessageFetchResponse
  | UserExternalLoginResponse
  | MessageDeliverResponse
  | MessageReadResponse
  | ErrorResponse;
