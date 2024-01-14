import { ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFormPageRoutingModule } from './add-form-routing.module';
import { AddFormPage } from './add-form.page';
import { AddFormPageModule } from './add-form.module';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { PurchasesService } from '../service/purchases.service';
import { CryptoPurchaseBuilder } from '../types/cryptoPurchase.builder';
import { CryptoName } from '../types/cryptoName.type';
import { CurrencyEnum } from '../types/currencyEnum';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Value } from '../types/value.type';
import { of } from 'rxjs';
import { ValueService } from '../service/value.service';
import * as moment from 'moment';
import { SettingsService } from '../service/settings.service';

describe('AddFormPage', () => {
  let component: AddFormPage;
  let fixture: ComponentFixture<AddFormPage>;
  let mockPurchasesService: jasmine.SpyObj<PurchasesService>;
  let mockValueService: jasmine.SpyObj<ValueService>;
  let mockToastController: jasmine.SpyObj<ToastController>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  mockPurchasesService = jasmine.createSpyObj('mockPurchasesService', ['addPurchase', 'getAllPurchases', 'getAllUniqueIds']);
  mockValueService = jasmine.createSpyObj('mockValueService', ['createNewValue']);
  mockToastController = jasmine.createSpyObj('mockToastController', ['create']);
  mockSettingsService = jasmine.createSpyObj('mockSettingsService', ['getSelectedCurrency']);

  beforeEach(waitForAsync(() => {
    mockPurchasesService.getAllPurchases.and.returnValue(of([]));
    mockPurchasesService.getAllUniqueIds.and.returnValue([]);
    mockSettingsService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
    TestBed.configureTestingModule({
      declarations: [ AddFormPage ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, RouterTestingModule, AddFormPageModule, HttpClientModule ],
      providers: [
        { provide: PurchasesService, useValue: mockPurchasesService },
        { provide: ToastController, useValue: mockToastController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('the add button', () => {
    it('should not be clickable if the form is invalid', () => {
      //act
      const addButton = fixture.debugElement.query(By.css('#add-button'));

      //assert
      expect(component.cryptoForm.valid).toBe(false);
      expect(addButton.nativeElement.disabled).toBe(true);
    });
  
    it('should be clickable and call submitForm if the form is valid', () => {
      //arrange
      component.cryptoForm.setValue({ name: 'Cardano (ADA)', quantity: 2, perCoinPurchasePrice: '',  totalPurchasePrice: 25.65 });
  
      //act
      const addButton = fixture.debugElement.query(By.css('#add-button'));
      fixture.detectChanges();
  
      //assert
      expect(component.cryptoForm.valid).toBe(true);
      expect(addButton.nativeElement.disabled).toBe(false);
    });
  });

  describe('the clear button', () => {
    it('clears all inputs on the form', () => {
      //arrange
      component.cryptoForm.setValue({ name: 'Cardano (ADA)', quantity: 2, perCoinPurchasePrice: '',  totalPurchasePrice: 25.65 });
      expect(component.cryptoForm.valid).toBe(true);

      //act
      const clearButton = fixture.debugElement.query(By.css('#clear-button'));
      clearButton.triggerEventHandler('click', null);
      fixture.detectChanges();
  
      //assert
      expect(component.cryptoForm.valid).toBe(false);
      expect(clearButton.nativeElement.disabled).toBe(false);
    });
  });

  describe('submitForm()', () => {  
    it('calls purchasesService using the data entered in the form', () => { //currency appearing as NaN
      //arrange
      const sampleName = new CryptoName("Cardano", "ADA", 12)
      const expectedCryptoPurchase = new CryptoPurchaseBuilder()
        .name(new CryptoName("Cardano", "ADA", 12))
        .purchaseDetails(new PurchaseDetails(11.34, CurrencyEnum.EUR, new Date()))
        .quantity(2)
        .value(new Value(15, CurrencyEnum.EUR, new Date()))
        .build();
      component.cryptoForm.setValue({ name: sampleName, quantity: 2, perCoinPurchasePrice: 11.34,  totalPurchasePrice: '' });

      //act
      component.submitForm();
  
      //assert
      expect(mockPurchasesService.addPurchase).toHaveBeenCalledWith(expectedCryptoPurchase);
    });

    it('displays a toast with the correct information', () => { 
      //arrange
      mockValueService.createNewValue.and.returnValue(new Value(11.34, CurrencyEnum.EUR, moment().toDate()))
      const sampleName = new CryptoName("Cardano", "ADA", 12)
      const expectedToast = {
        message: "Added 2 Cardano @ 11.34 EUR",
        duration: 2000
      }
      component.cryptoForm.setValue({ name: sampleName, quantity: 2, perCoinPurchasePrice: 11.34,  totalPurchasePrice: '' });
      fixture.detectChanges();

      //act
      component.submitForm();
  
      //assert
      expect(mockToastController.create).toHaveBeenCalledWith(expectedToast);
    });
  });

  //need unit tests to cover per coin vs total price

});
