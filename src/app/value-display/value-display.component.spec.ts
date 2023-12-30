import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ValueDisplayComponent } from './value-display.component';
import { SettingsService } from '../service/settings.service';
import { of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';

describe('ValueDisplayComponent', () => {
  let component: ValueDisplayComponent;
  let fixture: ComponentFixture<ValueDisplayComponent>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  mockSettingsService = jasmine.createSpyObj('mockPurchasesService', ['getSelectedCurrency']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueDisplayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    mockSettingsService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
    expect(component).toBeTruthy();
  });
});
