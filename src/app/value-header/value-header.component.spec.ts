import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ProfitFormatPipe } from '../shared/pipes/profit-format.pipe';

import { ValueHeaderComponent } from './value-header.component';

describe('ValueHeaderComponent', () => {
  let component: ValueHeaderComponent;
  let fixture: ComponentFixture<ValueHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueHeaderComponent, ProfitFormatPipe ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValueHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCssClass', () => {
    it('should apply the positive css class for positive values', () => {
      // Arrange
      component.totalProfit = 25.2643724

      // Act
      component.getCssClass()
      fixture.detectChanges();

      // Assert
      const element = fixture.debugElement.query(By.css('ion-card-content'));
      expect(element.classes['positive']).toBeTruthy();
    });
    it('should return "negative" for negative values', () => {
      // Arrange
      component.totalProfit = -25.2643724

      // Act
      component.getCssClass()
      fixture.detectChanges();

      // Assert
      const element = fixture.debugElement.query(By.css('ion-card-content'));
      expect(element.classes['negative']).toBeTruthy();
    });
  });
});
