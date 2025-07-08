import { AppUser, User } from '../../user';
import { Message } from '../../message';

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

export interface MessageSendRequestPayload {
  message: {
    to: string;
    text: string;
  };
}

export interface MessageSendResponsePayload {
  message: Message;
}

export interface MessageFetchRequestPayload {
  user: {
    login: string;
  };
}

export interface MessageFetchResponsePayload {
  messages: Message[];
}

export interface UserExternalLoginResponsePayload {
  user: User;
}
