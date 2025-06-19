import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  public readonly login = signal<string>('');
  public readonly isLogged = computed(() => Boolean(true));
}
