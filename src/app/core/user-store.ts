import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  public readonly user = signal<string>('');
  public readonly isLogged = signal<boolean>(false);
}
