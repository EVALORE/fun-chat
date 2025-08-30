import { User } from '../../user';
import { Message } from '../../message';

export interface UserLoginPayload {
  login: string;
  password: string;
}

export interface UserLoginResponsePayload {
  login: string;
  isOnline: boolean;
}

export interface UserLogoutPayload {
  login: string;
}

export interface UserLogoutResponsePayload {
  login: string;
  isOnline: boolean;
}

export interface UserListRequestPayload {
  filter?: 'online' | 'offline';
}

export interface UserListResponsePayload {
  users: User[];
}

export interface ErrorPayload {
  error: string;
}

export interface MessageSendRequestPayload {
  to: string;
  text: string;
}

export type MessageSendResponsePayload = Message;

export interface MessageFetchRequestPayload {
  login: string;
}

export interface MessageFetchResponsePayload {
  messages: Message[];
}

export interface UserExternalLoginResponsePayload {
  login: string;
  isOnline: boolean;
}

export interface UserExternalLogoutResponsePayload {
  login: string;
  isOnline: boolean;
}

export interface MessageDeliverResponsePayload {
  id: string;
  isDelivered: boolean;
}

export interface MessageReadRequestPayload {
  id: string;
}

export interface MessageReadResponsePayload {
  id: string;
  isRead: boolean;
}

export interface MessageEditRequestPayload {
  id: string;
  text: string;
}

export interface MessageEditResponsePayload {
  id: string;
  text: string;
  isEdited: boolean;
}

export interface MessageDeleteRequestPayload {
  id: string;
}

export interface MessageDeleteResponsePayload {
  id: string;
  isDeleted: boolean;
}
