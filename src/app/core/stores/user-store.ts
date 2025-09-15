import { computed, Injectable, signal } from '@angular/core';
import { AppUser } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly user = signal<AppUser | null>(null);

  public readonly name = computed(() => this.user()?.login ?? '');
  public readonly isOnline = computed(() => Boolean(this.user()));

  public logout(): void {
    this.user.set(null);
  }

  public login(user: AppUser): void {
    this.user.set(user);
  }
}
