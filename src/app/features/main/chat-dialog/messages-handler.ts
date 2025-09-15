import {inject, Injectable} from '@angular/core';
import {WebSocketClient} from '../../../core/api/web-socket-client';
import {filter, map, merge, Observable, scan, shareReplay, startWith, Subject, switchMap, tap,} from 'rxjs';
import {Message} from '../../../shared/models/message';

import {toObservable} from '@angular/core/rxjs-interop';
import {ChatApiResponse} from '../../../core/api/types/response';
import {
  MessageDeleteResponsePayload,
  MessageDeliverResponsePayload,
  MessageEditResponsePayload,
  MessageFetchResponsePayload,
  MessageReadResponsePayload,
  MessageSendResponsePayload,
} from '../../../core/api/types/payloads';
import {ReceiverStore} from '../../../core/stores/receiver-store';

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
  private readonly receiver = inject(ReceiverStore);

  private readonly mergeNew$ = new Subject<void>();

  private readonly messageHandlers: MessageHandlers = {
    MSG_DELETE: (accumulator, payload) =>
      this.onMessageDelete(accumulator, payload as MessageDeleteResponsePayload),
    MSG_DELIVER: (accumulator, payload) =>
      this.onMessageDeliver(accumulator, payload as MessageDeliverResponsePayload),
    MSG_EDIT: (accumulator, payload) =>
      this.onMessageEdit(accumulator, payload as MessageEditResponsePayload),
    MSG_READ: (accumulator, payload) =>
      this.onMessageRead(accumulator, payload as MessageReadResponsePayload),
    MSG_SEND: (accumulator, payload, receiverLogin) =>
      this.onMessageSend(accumulator, payload as MessageSendResponsePayload, receiverLogin),
  };

  private messageState = toObservable(this.receiver.login).pipe(
    filter(Boolean),
    switchMap((receiver) => this.getMessagesForReceiver(receiver)),
    shareReplay(1),
  );

  public oldMessages$ = this.messageState.pipe(map((state) => state.oldMessages));
  public newMessages$ = this.messageState.pipe(map((state) => state.newMessages));
  public showDivider = this.messageState.pipe(map((state) => state.showDivider));
  public isEmpty$ = this.messageState.pipe(map((state) => state.isEmpty));

  private onMessageDelete(
    accumulator: DialogState,
    payload: MessageDeleteResponsePayload,
  ): DialogState {
    return {
      ...accumulator,
      oldMessages: accumulator.oldMessages.filter((message) => message.id !== payload.id),
    };
  }

  private onMessageDeliver(
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

  private onMessageEdit(
    accumulator: DialogState,
    payload: MessageEditResponsePayload,
  ): DialogState {
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

  private onMessageRead(
    accumulator: DialogState,
    payload: MessageReadResponsePayload,
  ): DialogState {
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

  private onMessageSend(
    accumulator: DialogState,
    payload: MessageSendResponsePayload,
    receiverLogin: string,
  ): DialogState {
    const isFromReceiver = payload.from === receiverLogin;
    const isToReceiver = payload.to === receiverLogin;

    if (!isFromReceiver && !isToReceiver) {
      return accumulator;
    }

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

  public getMessagesForReceiver(login: string): Observable<DialogState> {
    this.ws.send('MSG_FROM_USER', { login });

    const initial$ = this.ws
      .onType('MSG_FROM_USER')
      .pipe(map(({ payload }) => this.handleInitialMessages(payload)));

    const reducers$ = merge(this.wsReducers(login), this.uiReducers());

    return initial$.pipe(
      tap((state) => {
        this.sendReadForNewMessages(state, login);
      }),
      switchMap((initialState) =>
        reducers$.pipe(
          scan((state, reducer) => reducer(state), initialState),
          startWith(initialState),
        ),
      ),
    );
  }

  private wsReducers(login: string): Observable<Reducer> {
    const updates$ = merge(
      this.ws.onType('MSG_SEND'),
      this.ws.onType('MSG_DELIVER'),
      this.ws.onType('MSG_READ'),
      this.ws.onType('MSG_EDIT'),
      this.ws.onType('MSG_DELETE'),
    );
    return updates$.pipe(
      map((response) => (state: DialogState) => this.processMessage(state, response, login)),
    );
  }

  private uiReducers(): Observable<Reducer> {
    return this.mergeNew$.pipe(map(() => (state: DialogState) => this.moveNewMessagesToOld(state)));
  }

  private processMessage(
    accumulator: DialogState,
    response: ChatApiResponse,
    login: string,
  ): DialogState {
    const { type, payload } = response;

    if (type in this.messageHandlers) {
      const handler = this.messageHandlers[type as MessageType];
      return handler(accumulator, payload, login);
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

  public sendMessage(text: string): void {
    this.ws.send('MSG_SEND', { to: this.receiver.login(), text });
  }

  public editMessage(id: string, text: string): void {
    this.ws.send('MSG_EDIT', { id, text });
  }

  public deleteMessage(id: string): void {
    this.ws.send('MSG_DELETE', { id });
  }

  public mergeMessages(): void {
    this.mergeNew$.next();
  }
}
