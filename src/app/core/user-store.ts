import { computed, Injectable, signal } from '@angular/core';
import { AppUser } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly user = signal<AppUser | null>(null);

  public readonly name = computed(() => this.user()?.login ?? '');
  public readonly isLogged = computed(() => Boolean(true));

  public logout(): void {
    this.user.set(null);
  }

  public login(user: AppUser): void {
    this.user.set(user);
  }
}
