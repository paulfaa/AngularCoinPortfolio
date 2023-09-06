import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import * as moment from 'moment';
import { CurrencyEnum } from '../types/currencyEnum';
import { PurchasesService } from '../service/purchases.service';
import { CryptoPurchaseBuilder } from '../types/cryptoPurchase.builder';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { CryptoName } from '../types/cryptoName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Value } from '../types/value.type';
import { ValueFooterComponent } from './value-footer.component';

describe('ValueFooterComponent', () => {
  let component: ValueFooterComponent;
  let fixture: ComponentFixture<ValueFooterComponent>;
  let mockCoinService: jasmine.SpyObj<PurchasesService>;

  mockCoinService = jasmine.createSpyObj('mockCoinService', ['getCoinsByTicker', 'getCoinsById']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValueFooterComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValueFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('calculateValueOfId()', () => {
    it('returns the value of all coins for the specified id', () => {
      //Arrange
      const c1 = new CryptoPurchaseBuilder()
          .name(new CryptoName("Cardano", "ADA"))
          .id(12)
          .purchaseDetails(new PurchaseDetails(12.2346, CurrencyEnum.EUR, moment().toDate()))
          .quantity(0.527)
          .value(new Value(25.25, CurrencyEnum.EUR, moment().toDate()))
          .profit(15)
          .build();
        const c2 = new CryptoPurchaseBuilder()
          .name(new CryptoName("Cardano", "ADA"))
          .id(12)
          .purchaseDetails(new PurchaseDetails(12.2346, CurrencyEnum.EUR, moment().toDate()))
          .quantity(1.847)
          .value(new Value(15.55, CurrencyEnum.EUR, moment().toDate()))
          .profit(10)
          .build();
      const coinList: CryptoPurchase[] = [c1, c2]
      component.coinId = 12;
      mockCoinService.getCoinsById.and.returnValue(coinList);

      //Act
      const result = component.calculateValueOfId();

      //Assert
      expect(result).toBe(55);
    });
    it('returns the value of all coins for the specified id', () => {
      //Arrange
      const coinList: CryptoPurchase[] = []
      component.coinId = 12;
      mockCoinService.getCoinsById.and.returnValue(coinList);

      //Act
      const result = component.calculateValueOfId();

      //Assert
      expect(result).toBe(0);
    });
  });

  it('returns the sum of all holdings for the specified ticker', () => {
    // Arrange
    const coinList: CryptoPurchase[] = [
      new CryptoPurchaseBuilder()
        .name(new CryptoName("Cardano", "ADA"))
        .purchaseDetails(new PurchaseDetails(12.2346, CurrencyEnum.EUR, moment().toDate()))
        .quantity(0.527)
        .value(new Value(25.25, CurrencyEnum.EUR, moment().toDate()))
        .profit(15)
        .build(),
      new CryptoPurchaseBuilder()
        .name(new CryptoName("Cardano", "ADA"))
        .purchaseDetails(new PurchaseDetails(12.2346, CurrencyEnum.EUR, moment().toDate()))
        .quantity(1.847)
        .value(new Value(15.55, CurrencyEnum.EUR, moment().toDate()))
        .profit(10)
        .build()
    ]

    component.ticker = "ADA";
    //fixture.detectChanges();

    // Act
    mockCoinService.getPurchasesByTicker.and.returnValue(coinList);
    component.calculateValueOfTicker();

    // Assert
    expect(fixture.nativeElement.querySelector('div').innerText).toEqual(40.80);
  });

  it('returns 0 when the user does not hold any of the specified ticker', () => {
    // Arrange
    component.ticker = "ADA";

    // Act
    component.calculateValueOfTicker();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelector('div').innerText).toEqual('0');
  });
});
