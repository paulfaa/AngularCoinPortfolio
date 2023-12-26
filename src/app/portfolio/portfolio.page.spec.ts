import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PurchasesService } from '../service/purchases.service';
import { ValueService } from '../service/value.service';
import { ProfitFormatPipe } from '../shared/pipes/profit-format.pipe';

import { PortfolioPage } from './portfolio.page';

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;
  let purchasesService: PurchasesService;
  let valueService: ValueService;
  let mockPurchasesService: jasmine.SpyObj<PurchasesService>;

  mockPurchasesService = jasmine.createSpyObj('mockPurchasesService', ['getLengthOfHeldCoins']);
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioPage, ProfitFormatPipe ],
      imports: [IonicModule.forRoot(), HttpClientModule],
      providers: [                   
        { provide: purchasesService, useValue: mockPurchasesService},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /* describe("showEmptyPortfolioAlert()", () => {
    it("is called when the user portfolio is empty", () => {
      // Arrange
      mockCoinService.getNumberOfPurchases.and.returnValue(0);
      spyOn(component, 'showEmptyPortfolioAlert')

      // Assert
      expect(component.showEmptyPortfolioAlert).toHaveBeenCalled;

    });
    it("is is not called when the user portfolio contains items", () => {
      // Arrange
      mockCoinService.getNumberOfPurchases.and.returnValue(3);

      // Assert
      expect(component.showEmptyPortfolioAlert).not.toHaveBeenCalled;

    });
  }); */

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
