import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ValueDisplayComponent } from './value-display.component';
import { SettingsService } from '../service/settings.service';
import { of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';
import { PurchasesService } from '../service/purchases.service';

describe('ValueDisplayComponent', () => {
  let component: ValueDisplayComponent;
  let fixture: ComponentFixture<ValueDisplayComponent>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockPurchasesService: jasmine.SpyObj<PurchasesService>;

  mockSettingsService = jasmine.createSpyObj('mockSettingsService', ['getSelectedCurrency']);
  mockPurchasesService = jasmine.createSpyObj('mockPurchasesService', ['getPurchasesById']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueDisplayComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: PurchasesService, useValue: mockPurchasesService }
      ]
    }).compileComponents();
    mockPurchasesService.getPurchasesById.and.returnValue(of([]));
    mockSettingsService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
    fixture = TestBed.createComponent(ValueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
