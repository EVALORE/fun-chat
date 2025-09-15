import { computed, Injectable, signal } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class ReceiverStore {
  private readonly receiver = signal<User | null>(null);

  public readonly login = computed(() => this.receiver()?.login ?? '');
  public readonly isOnline = computed(() => Boolean(this.receiver()?.isOnline));

  public setReceiver(receiver: User | null): void {
    if (receiver?.login === this.login()) {
      return;
    }

    this.receiver.set(receiver);
  }
}
