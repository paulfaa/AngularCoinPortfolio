import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CoinServiceComponent } from '../service/coin.service';
import { ValueServiceComponent } from '../service/value.service';

import { PortfolioPage } from './portfolio.page';

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;
  let coinService: CoinServiceComponent;
  let valueService: ValueServiceComponent;
  let coinServiceSpy: any;

  beforeEach(waitForAsync(() => {
    coinServiceSpy = jasmine.createSpyObj('coinService', 'getLengthOfHeldCoins');
    coinServiceSpy.getLengthOfHeldCoins.returnValue(0);
    TestBed.configureTestingModule({
      declarations: [ PortfolioPage ],
      imports: [IonicModule.forRoot()],
      providers: [                   
        { provide: coinService, useValue: coinServiceSpy},
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe("showEmptyPortfolioAlert()", () => {
    it("is called when the user portfolio is empty", () => {
      // Arrange

      // Act
      component.showEmptyPortfolioAlert()

      // Assert
      expect()

    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
