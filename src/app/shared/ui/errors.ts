import { Directive, effect, inject, input } from '@angular/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';

@Directive({
  selector: '[appErrors]',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: (): object => ({}),
    },
  ],
})
export class Errors {
  private readonly tuiErrors = inject(TUI_VALIDATION_ERRORS);

  public readonly errors = input.required<Record<string, string>>({
    alias: 'appErrors',
  });

  constructor() {
    effect(() => {
      Object.entries(this.errors()).forEach(([key, value]) => {
        this.tuiErrors[key] = value;
      });
    });
  }
}
