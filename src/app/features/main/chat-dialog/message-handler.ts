import { inject, Injectable, signal } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { filter, merge, Observable, scan, switchMap, tap } from 'rxjs';
import { Message } from '../../../core/message';
import {
  MessageDeleteResponsePayload,
  MessageDeliverResponsePayload,
  MessageEditResponsePayload,
  MessageFetchResponsePayload,
  MessageReadResponsePayload,
  MessageSendResponsePayload,
} from '../../../core/api/types/payloads';
import { User } from '../../../core/user';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChatApiResponse } from '../../../core/api/types/response';

type MessageType =
  | 'MSG_FROM_USER'
  | 'MSG_SEND'
  | 'MSG_DELIVER'
  | 'MSG_READ'
  | 'MSG_EDIT'
  | 'MSG_DELETE';

@Injectable()
export class MessageHandler {
  private readonly ws = inject(WebSocketClient);
  private currentReceiver = signal<User | null>(null);
  private readonly messageHandlers: Record<
    MessageType,
    (
      accumulator: Message[],
      payload: ChatApiResponse['payload'],
      receiverLogin: string,
    ) => Message[]
  >;

  public messages = toObservable(this.currentReceiver).pipe(
    filter((receiver) => receiver !== null),
    switchMap((receiver) => this.getMessagesForReceiver(receiver)),
  );

  constructor() {
    this.messageHandlers = {
      MSG_FROM_USER: (_, payload): Message[] => (payload as MessageFetchResponsePayload).messages,
      MSG_SEND: (accumulator, payload, receiverLogin): Message[] =>
        this.handleMessageSend(accumulator, payload as MessageSendResponsePayload, receiverLogin),
      MSG_DELIVER: (accumulator, payload): Message[] =>
        this.handleMessageDeliver(accumulator, payload as MessageDeliverResponsePayload),
      MSG_READ: (accumulator, payload): Message[] =>
        this.handleMessageRead(accumulator, payload as MessageReadResponsePayload),
      MSG_EDIT: (accumulator, payload): Message[] =>
        this.handleMessageEdit(accumulator, payload as MessageEditResponsePayload),
      MSG_DELETE: (accumulator, payload): Message[] =>
        this.handleMessageDelete(accumulator, payload as MessageDeleteResponsePayload),
    };
  }

  public setReceiver(receiver: User): void {
    this.currentReceiver.set(receiver);
  }

  public getMessagesForReceiver(receiver: User): Observable<Message[]> {
    return merge(
      this.ws.onType('MSG_FROM_USER'),
      this.ws.onType('MSG_SEND'),
      this.ws.onType('MSG_DELIVER'),
      this.ws.onType('MSG_READ'),
      this.ws.onType('MSG_EDIT'),
      this.ws.onType('MSG_DELETE'),
    ).pipe(
      tap((response) => {
        this.handleSideEffects(response, receiver.login);
      }),
      scan(
        (accumulator, response) => this.processMessage(accumulator, response, receiver),
        [] as Message[],
      ),
    );
  }

  private handleSideEffects(response: ChatApiResponse, receiverLogin: string): void {
    if (response.type === 'MSG_FROM_USER') {
      this.handleUnreadMessages(response.payload, receiverLogin);
    }
    if (response.type === 'MSG_SEND') {
      this.handleIncomingMessage(response.payload, receiverLogin);
    }
  }

  private processMessage(
    accumulator: Message[],
    response: ChatApiResponse,
    receiver: User,
  ): Message[] {
    const { type, payload } = response;

    if (type in this.messageHandlers) {
      const handler = this.messageHandlers[type as MessageType];
      return handler(accumulator, payload, receiver.login);
    }

    return accumulator;
  }

  private handleUnreadMessages(
    { messages }: MessageFetchResponsePayload,
    receiverLogin: string,
  ): void {
    const unread = messages.filter((message) => message.from === receiverLogin && !message.isRead);
    if (unread.length > 0) {
      for (const message of unread) {
        this.ws.send('MSG_READ', { id: message.id });
      }
    }
  }

  private handleIncomingMessage(
    { from, id }: MessageSendResponsePayload,
    receiverLogin: string,
  ): void {
    if (from === receiverLogin) {
      this.ws.send('MSG_READ', { id });
    }
  }

  private handleMessageSend(
    accumulator: Message[],
    message: MessageSendResponsePayload,
    receiverLogin: string,
  ): Message[] {
    if (message.from === receiverLogin || message.to === receiverLogin) {
      return [...accumulator, message];
    }
    return accumulator;
  }

  private handleMessageDeliver(
    accumulator: Message[],
    payload: MessageDeliverResponsePayload,
  ): Message[] {
    return accumulator.map((message) =>
      message.id === payload.id ? { ...message, isDelivered: true } : message,
    );
  }

  private handleMessageRead(
    accumulator: Message[],
    payload: MessageReadResponsePayload,
  ): Message[] {
    return accumulator.map((message) =>
      message.id === payload.id ? { ...message, isRead: true } : message,
    );
  }

  private handleMessageEdit(
    accumulator: Message[],
    payload: MessageEditResponsePayload,
  ): Message[] {
    return accumulator.map((message) =>
      message.id === payload.id
        ? { ...message, text: payload.text, isEdited: payload.isEdited }
        : message,
    );
  }

  private handleMessageDelete(
    accumulator: Message[],
    payload: MessageDeleteResponsePayload,
  ): Message[] {
    if (payload.isDeleted) {
      return accumulator.filter((message) => message.id !== payload.id);
    }
    return accumulator;
  }
}
