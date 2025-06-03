import { TestBed } from '@angular/core/testing';

import { WebSocketClient } from './web-socket-client';

describe('WebSocketClient', () => {
  let service: WebSocketClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
