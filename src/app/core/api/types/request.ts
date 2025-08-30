import {
  MessageDeleteRequestPayload,
  MessageEditRequestPayload,
  MessageFetchRequestPayload,
  MessageReadRequestPayload,
  MessageSendRequestPayload,
  UserListRequestPayload,
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
export type UserListRequest = ApiRequest<'USER_LIST', UserListRequestPayload>;
export type MessageSendRequest = ApiRequest<'MSG_SEND', MessageSendRequestPayload>;
export type MessageFetchRequest = ApiRequest<'MSG_FROM_USER', MessageFetchRequestPayload>;
export type MessageReadRequest = ApiRequest<'MSG_READ', MessageReadRequestPayload>;
export type MessageEditRequest = ApiRequest<'MSG_EDIT', MessageEditRequestPayload>;
export type MessageDeleteRequest = ApiRequest<'MSG_DELETE', MessageDeleteRequestPayload>;

export type ChatApiRequest =
  | UserLoginRequest
  | UserLogoutRequest
  | UserListRequest
  | MessageFetchRequest
  | MessageSendRequest
  | MessageEditRequest
  | MessageDeleteRequest
  | MessageReadRequest;
