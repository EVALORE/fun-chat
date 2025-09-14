import { inject, Injectable, signal } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { filter, map, merge, Observable, scan, shareReplay, startWith, Subject, switchMap, tap, } from 'rxjs';
import { Message } from '../../../core/message';
import { User } from '../../../core/user';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChatApiResponse } from '../../../core/api/types/response';
import {
  MessageDeleteResponsePayload,
  MessageDeliverResponsePayload,
  MessageEditResponsePayload,
  MessageFetchResponsePayload,
  MessageReadResponsePayload,
  MessageSendResponsePayload,
} from '../../../core/api/types/payloads';

type MessageType = 'MSG_SEND' | 'MSG_DELIVER' | 'MSG_READ' | 'MSG_EDIT' | 'MSG_DELETE';

interface DialogState {
  oldMessages: Message[];
  newMessages: Message[];
  showDivider: boolean;
  isEmpty: boolean;
  mergeNew: boolean;
}

type Reducer = (state: DialogState) => DialogState;

type MessageHandlers = Record<
  MessageType,
  (
    accumulator: DialogState,
    payload: ChatApiResponse['payload'],
    receiverLogin: string,
  ) => DialogState
>;

@Injectable()
export class MessagesHandler {
  private readonly ws = inject(WebSocketClient);
  private currentReceiver = signal<User | null>(null);

  private readonly mergeNew$ = new Subject<void>();

  private readonly messageHandlers: MessageHandlers = {
    MSG_DELETE: (accumulator, payload) =>
      this.deleteMessage(accumulator, payload as MessageDeleteResponsePayload),
    MSG_DELIVER: (accumulator, payload) =>
      this.deliverMessage(accumulator, payload as MessageDeliverResponsePayload),
    MSG_EDIT: (accumulator, payload) =>
      this.editMessage(accumulator, payload as MessageEditResponsePayload),
    MSG_READ: (accumulator, payload) =>
      this.readMessage(accumulator, payload as MessageReadResponsePayload),
    MSG_SEND: (accumulator, payload, receiverLogin) =>
      this.sendMessage(accumulator, payload as MessageSendResponsePayload, receiverLogin),
  };

  private messageState = toObservable(this.currentReceiver).pipe(
    filter((receiver) => receiver !== null),
    switchMap((receiver) => this.getMessagesForReceiver(receiver)),
    shareReplay(1),
  );

  public oldMessages$ = this.messageState.pipe(map((state) => state.oldMessages));
  public newMessages$ = this.messageState.pipe(map((state) => state.newMessages));
  public showDivider = this.messageState.pipe(map((state) => state.showDivider));
  public isEmpty$ = this.messageState.pipe(map((state) => state.isEmpty));

  public setReceiver(receiver: User): void {
    if (this.currentReceiver()?.login !== receiver.login) {
      this.currentReceiver.set(receiver);
    }
  }

  private deleteMessage(
    accumulator: DialogState,
    payload: MessageDeleteResponsePayload,
  ): DialogState {
    return {
      ...accumulator,
      oldMessages: accumulator.oldMessages.filter((message) => message.id !== payload.id),
    };
  }

  private deliverMessage(
    accumulator: DialogState,
    payload: MessageDeliverResponsePayload,
  ): DialogState {
    return {
      ...accumulator,
      oldMessages: accumulator.oldMessages.map((message) =>
        message.id === payload.id ? { ...message, ...payload } : message,
      ),
    };
  }

  private editMessage(accumulator: DialogState, payload: MessageEditResponsePayload): DialogState {
    return {
      ...accumulator,
      oldMessages: accumulator.oldMessages.map((message) =>
        message.id === payload.id ? { ...message, ...payload } : message,
      ),
      newMessages: accumulator.newMessages.map((message) =>
        message.id === payload.id ? { ...message, ...payload } : message,
      ),
    };
  }

  private readMessage(accumulator: DialogState, payload: MessageReadResponsePayload): DialogState {
    return {
      ...accumulator,
      newMessages: accumulator.newMessages.map((message) =>
        message.id === payload.id ? { ...message, ...payload } : message,
      ),
      oldMessages: accumulator.oldMessages.map((message) =>
        message.id === payload.id ? { ...message, ...payload } : message,
      ),
    };
  }

  private sendMessage(
    accumulator: DialogState,
    payload: MessageSendResponsePayload,
    receiverLogin: string,
  ): DialogState {
    const isFromReceiver = payload.from === receiverLogin;

    if (isFromReceiver) {
      this.ws.send('MSG_READ', { id: payload.id });

      if (accumulator.mergeNew) {
        return {
          ...accumulator,
          oldMessages: [...accumulator.oldMessages, payload],
          isEmpty: false,
          showDivider: false,
        };
      }

      return {
        ...accumulator,
        newMessages: [...accumulator.newMessages, payload],
        isEmpty: false,
        showDivider: true,
      };
    }

    return this.moveNewMessagesToOld(accumulator, [payload]);
  }

  private handleInitialMessages({ messages }: MessageFetchResponsePayload): DialogState {
    const oldMessages = messages.filter((message: Message) => message.isRead);
    const newMessages = messages.filter((message: Message) => !message.isRead);

    return {
      oldMessages,
      newMessages,
      isEmpty: oldMessages.length + newMessages.length === 0,
      showDivider: newMessages.length > 0,
      mergeNew: false,
    };
  }

  public getMessagesForReceiver(receiver: User): Observable<DialogState> {
    this.ws.send('MSG_FROM_USER', { login: receiver.login });

    const initial$ = this.ws
      .onType('MSG_FROM_USER')
      .pipe(map(({ payload }) => this.handleInitialMessages(payload)));

    const reducers$ = merge(this.wsReducers(receiver), this.uiReducers());

    return initial$.pipe(
      tap((state) => {
        this.sendReadForNewMessages(state, receiver.login);
      }),
      switchMap((initialState) =>
        reducers$.pipe(
          scan((state, reducer) => reducer(state), initialState),
          startWith(initialState),
        ),
      ),
    );
  }

  private wsReducers(receiver: User): Observable<Reducer> {
    const updates$ = merge(
      this.ws.onType('MSG_SEND'),
      this.ws.onType('MSG_DELIVER'),
      this.ws.onType('MSG_READ'),
      this.ws.onType('MSG_EDIT'),
      this.ws.onType('MSG_DELETE'),
    );
    return updates$.pipe(
      map((response) => (state: DialogState) => this.processMessage(state, response, receiver)),
    );
  }

  private uiReducers(): Observable<Reducer> {
    return this.mergeNew$.pipe(map(() => (state: DialogState) => this.moveNewMessagesToOld(state)));
  }

  private processMessage(
    accumulator: DialogState,
    response: ChatApiResponse,
    receiver: User,
  ): DialogState {
    const { type, payload } = response;

    if (type in this.messageHandlers) {
      const handler = this.messageHandlers[type as MessageType];
      return handler(accumulator, payload, receiver.login);
    }

    return accumulator;
  }

  private sendReadForNewMessages(state: DialogState, receiverLogin: string): void {
    const newMessagesFromReceiver = state.newMessages.filter(
      (message) => !message.isRead && message.from === receiverLogin,
    );
    for (const message of newMessagesFromReceiver) {
      this.ws.send('MSG_READ', { id: message.id });
    }
  }

  private moveNewMessagesToOld(state: DialogState, extraOldMessages: Message[] = []): DialogState {
    return {
      oldMessages: [...state.oldMessages, ...state.newMessages, ...extraOldMessages],
      newMessages: [],
      isEmpty: false,
      showDivider: false,
      mergeNew: true,
    };
  }

  public mergeMessages(): void {
    this.mergeNew$.next();
  }
}
