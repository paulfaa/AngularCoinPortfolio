import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SettingsPage } from './settings.page';
import { SettingsService } from '../service/settings.service';
import { of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let client: HttpClient;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  mockSettingsService = jasmine.createSpyObj('mockPurchasesService', ['getSelectedCurrency']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPage ],
      imports: [HttpClientModule, IonicModule.forRoot()],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    mockSettingsService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
    expect(component).toBeTruthy();
  });
});
