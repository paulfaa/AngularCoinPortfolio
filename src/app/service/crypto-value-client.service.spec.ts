import { TestBed } from '@angular/core/testing';

import { CryptoValueClientService } from './crypto-value-client.service';

describe('HttpClientClientService', () => {
  let service: CryptoValueClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoValueClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
