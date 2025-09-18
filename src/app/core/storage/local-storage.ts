import { StorageService } from './storage';
import { LocalStorageStore } from './storage-store';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

export class LocalStorageService extends StorageService<LocalStorageStore> {
  constructor() {
    const prefix = 'LP';
    super(localStorage, prefix);
  }
}

export function provideLocalStorageService(): EnvironmentProviders {
  return makeEnvironmentProviders([LocalStorageService]);
}
