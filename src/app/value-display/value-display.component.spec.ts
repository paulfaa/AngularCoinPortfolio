import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ValueDisplayComponent } from './value-display.component';
import { SettingsService } from '../service/settings.service';
import { of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';
import { PurchasesService } from '../service/purchases.service';
import { CryptoPurchaseBuilder } from '../types/cryptoPurchase.builder';
import { CryptoName } from '../types/cryptoName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Value } from '../types/value.type';
import { CryptoPurchase } from '../types/cryptoPurchase.type';

describe('ValueDisplayComponent', () => {
  let component: ValueDisplayComponent;
  let purchase1: CryptoPurchase;
  let purchase2: CryptoPurchase;
  let fixture: ComponentFixture<ValueDisplayComponent>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockPurchasesService: jasmine.SpyObj<PurchasesService>;

  mockSettingsService = jasmine.createSpyObj('mockSettingsService', ['getSelectedCurrency']);
  mockPurchasesService = jasmine.createSpyObj('mockPurchasesService', ['getPurchasesById']);
  purchase1 = new CryptoPurchaseBuilder()
    .name(new CryptoName("Bitcoin", "BTC", 1))
    .purchaseDetails(new PurchaseDetails(5, CurrencyEnum.EUR, new Date()))
    .quantity(5)
    .value(new Value(15, CurrencyEnum.EUR, new Date()))
    .build();
  purchase2 = new CryptoPurchaseBuilder()
    .name(new CryptoName("Bitcoin", "BTC", 1))
    .purchaseDetails(new PurchaseDetails(5, CurrencyEnum.EUR, new Date()))
    .quantity(10)
    .value(new Value(30, CurrencyEnum.EUR, new Date()))
    .build();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValueDisplayComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: PurchasesService, useValue: mockPurchasesService }
      ]
    }).compileComponents();
    mockPurchasesService.getPurchasesById.and.returnValue(of([purchase1, purchase2]));
    mockSettingsService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
    fixture = TestBed.createComponent(ValueDisplayComponent);
    component = fixture.componentInstance;
    component.coinName = { displayName: 'Bitcoin', ticker: 'BTC' };
    component.idInput = 1;
    component.currencySymbolInput = of('$');

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('calculates the value/profit/percentage based on the provided purchases', () => {
      //Arrange
      const expectedValue = 45;
      const expectedProfit = 35;
      const expectedProfitPercentage = 350;
      const expectedExpenditure = 10;

      //Act
      component.ngOnInit();
      const value = component.totalValue$;
      const profit = component.totalProfit$;
      const profitPercentage = component.profitPercentage$;
      const expenditure = component['expenditure$'];

      //Assert
      value.subscribe(value => {
        expect(value).toEqual(expectedValue);
      });
      profit.subscribe(profit => {
        expect(profit).toEqual(expectedProfit);
      });
      profitPercentage.subscribe(profitPercentage => {
        expect(profitPercentage).toEqual(expectedProfitPercentage);
      });
      expenditure.subscribe(expenditure => {
        expect(expenditure).toEqual(expectedExpenditure);
      });
    });
  });

  describe('onDeletePurchase', () => {
    it('should emit the deletePurchaseEvent containing the correct purchase details', () => {
      //Arrange
      const spy = spyOn(component.deletePurchaseEvent, 'emit');

      //Act
      component.onDeletePurchase(purchase1);

      //Assert
      expect(spy).toHaveBeenCalledWith(purchase1);
    });
  });

  describe('onInfoPopup', () => {
    it('should emit the infoPopupEvent containing the correct purchase details', () => {
      //Arrange
      const spy = spyOn(component.infoPopupEvent, 'emit');

      //Act
      component.onInfoPopup(purchase1);

      //Assert
      expect(spy).toHaveBeenCalledWith(purchase1);
    });
  });
});
