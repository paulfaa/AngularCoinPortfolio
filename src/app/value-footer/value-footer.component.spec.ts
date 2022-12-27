import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import * as moment from 'moment';
import { CurrencyEnum } from '../currencyEnum';
import { CoinService } from '../service/coin.service';
import { CoinBuilder } from '../types/coin.builder';
import { Coin } from '../types/coin.type';
import { CoinName } from '../types/coinName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Value } from '../types/value.type';

import { ValueFooterComponent } from './value-footer.component';

describe('ValueFooterComponent', () => {
  let component: ValueFooterComponent;
  let fixture: ComponentFixture<ValueFooterComponent>;
  let mockCoinService: jasmine.SpyObj<CoinService>;

  mockCoinService = jasmine.createSpyObj('mockCoinService', ['getCoinsByTicker']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueFooterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValueFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('returns the sum of all holdings for the specified ticker', () => {
    // Arrange
    const coinList: Coin[] = [
      new CoinBuilder()
            .name(new CoinName("Cardano", "ADA"))
            .purchaseDetails(new PurchaseDetails(12.2346, CurrencyEnum.EUR, moment().toDate()))
            .quantity(0.527)
            .value(new Value(25.25, CurrencyEnum.EUR, moment().toDate()))
            .profit(15)
            .build(),
            new CoinBuilder()
            .name(new CoinName("Cardano", "ADA"))
            .purchaseDetails(new PurchaseDetails(12.2346, CurrencyEnum.EUR, moment().toDate()))
            .quantity(1.847)
            .value(new Value(15.55, CurrencyEnum.EUR, moment().toDate()))
            .profit(10)
            .build()
  ]
    
    component.ticker = "ADA";
    //fixture.detectChanges();

    // Act
    mockCoinService.getCoinsByTicker.and.returnValue(coinList);
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
