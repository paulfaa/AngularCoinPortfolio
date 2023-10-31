import { TestBed } from '@angular/core/testing';

import { CryptoValueClientService } from './crypto-value-client.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CryptoValueClientService', () => {
  let service: CryptoValueClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
  }).compileComponents();
    service = TestBed.inject(CryptoValueClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCryptoValues', () => {
    it('should return an empty array if no IDs are provided', () => {
      //arrange
      const currency = 'EUR';
      const ids: number[] = [];
  
      //act
      var result = service.getCryptoValues(currency, ids).subscribe();
  
      //assert
      //expect(result).toEqual(of([]));
      const req = httpMock.expectOne(request => request.url === "http://localhost:8080/values");
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  
    it('should send a GET request with the correct request parameters', () => {
      //arrange
      const currency = 'EUR';
      const ids = [1, 2, 3];
      
      //act
      var result = service.getCryptoValues(currency, ids).subscribe();
  
      const req = httpMock.expectOne(request => request.url === "http://localhost:8080/values");
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('currency')).toBe(currency);
      expect(req.request.params.get('requestIds')).toBe(ids.join(','));
    });
  });
});
