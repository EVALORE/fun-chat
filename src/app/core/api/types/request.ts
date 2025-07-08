import {
  MessageFetchRequestPayload,
  MessageSendRequestPayload,
  UserLoginPayload,
  UserLogoutPayload,
} from './payloads';

export interface ApiRequest<T extends string, P> {
  id: string;
  type: T;
  payload: P;
}

export type UserLoginRequest = ApiRequest<'USER_LOGIN', UserLoginPayload>;
export type UserLogoutRequest = ApiRequest<'USER_LOGOUT', UserLogoutPayload>;
export type UserActiveRequest = ApiRequest<'USER_ACTIVE', null>;
export type UserInactiveRequest = ApiRequest<'USER_INACTIVE', null>;
export type MessageSendRequest = ApiRequest<'MSG_SEND', MessageSendRequestPayload>;
export type MessageFetchRequest = ApiRequest<'MSG_FROM_USER', MessageFetchRequestPayload>;

export type ChatApiRequest =
  | UserLoginRequest
  | UserLogoutRequest
  | UserActiveRequest
  | UserInactiveRequest
  | MessageFetchRequest
  | MessageSendRequest;
