import { inject, Injectable, signal } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { filter, merge, Observable, scan, switchMap, tap } from 'rxjs';
import { Message } from '../../../core/message';
import {
  MessageDeliverResponsePayload,
  MessageFetchResponsePayload,
  MessageReadResponsePayload,
  MessageSendResponsePayload,
} from '../../../core/api/types/payloads';
import { User } from '../../../core/user';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class MessageHandler {
  private readonly ws = inject(WebSocketClient);

  private currentReceiver = signal<User | null>(null);

  public messages = toObservable(this.currentReceiver).pipe(
    filter((receiver) => receiver !== null),
    switchMap((receiver) => this.getMessagesForReceiver(receiver)),
  );

  public setReceiver(receiver: User): void {
    this.currentReceiver.set(receiver);
  }

  public getMessagesForReceiver(receiver: User): Observable<Message[]> {
    return merge(
      this.ws.onType('MSG_FROM_USER'),
      this.ws.onType('MSG_SEND'),
      this.ws.onType('MSG_DELIVER'),
      this.ws.onType('MSG_READ'),
    ).pipe(
      tap((response) => {
        const receiverLogin = receiver.login;
        if (response.type === 'MSG_FROM_USER') {
          this.handleUnreadMessages(response.payload, receiverLogin);
        }
        if (response.type === 'MSG_SEND') {
          this.handleIncomingMessage(response.payload, receiverLogin);
        }
      }),
      scan((accumulator, response): Message[] => {
        const { type, payload } = response;
        const receiverLogin = receiver.login;

        switch (type) {
          case 'MSG_FROM_USER': {
            return payload.messages;
          }
          case 'MSG_SEND': {
            return this.handleMessageSend(accumulator, payload, receiverLogin);
          }
          case 'MSG_DELIVER': {
            return this.handleMessageDeliver(accumulator, payload);
          }
          case 'MSG_READ': {
            return this.handleMessageRead(accumulator, payload);
          }
          default: {
            return accumulator;
          }
        }
      }, [] as Message[]),
    );
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
}
