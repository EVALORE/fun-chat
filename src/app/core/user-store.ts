import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  public readonly user = signal<string>('');
  public readonly isLogged = computed(() => Boolean(this.user()));
}
