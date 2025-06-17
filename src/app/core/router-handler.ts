import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterHandler {
  private readonly router = inject(Router);

  public redirectToMain(): void {
    this.router.navigate(['']).catch((error: unknown) => {
      console.error(error);
    });
  }

  public redirectToLogin(): void {
    this.router.navigate(['auth']).catch((error: unknown) => {
      console.error(error);
    });
  }
}
