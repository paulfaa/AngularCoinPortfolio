import { TestBed } from '@angular/core/testing';

import { CryptoValueClientService } from './crypto-value-client.service';
import { HttpClientModule } from '@angular/common/http';

describe('CryptoValueClientService', () => {
  let service: CryptoValueClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
  }).compileComponents();
    service = TestBed.inject(CryptoValueClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
