import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CoinServiceComponent } from '../service/coin.service';
import { ValueServiceComponent } from '../service/value.service';
import { ProfitFormatPipe } from '../shared/pipes/profit-format.pipe';

import { PortfolioPage } from './portfolio.page';

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;
  let coinService: CoinServiceComponent;
  let valueService: ValueServiceComponent;
  let mockCoinService: jasmine.SpyObj<CoinServiceComponent>;

  mockCoinService = jasmine.createSpyObj('mockCoinService', ['getLengthOfHeldCoins']);
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioPage, ProfitFormatPipe ],
      imports: [IonicModule.forRoot(), HttpClientModule],
      providers: [                   
        { provide: coinService, useValue: mockCoinService},
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe("showEmptyPortfolioAlert()", () => {
    it("is called when the user portfolio is empty", () => {
      // Arrange
      mockCoinService.getLengthOfHeldCoins.and.returnValue(0);

      // Assert
      expect(component.showEmptyPortfolioAlert).toHaveBeenCalled;

    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
