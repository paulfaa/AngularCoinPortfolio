import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ProfitFormatPipe } from '../shared/pipes/profit-format.pipe';

import { ValueHeaderComponent } from './value-header.component';
import { of } from 'rxjs';

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

  describe('The component styling', () => {
    it('should apply the positive css class for positive values', () => {
      // Arrange
      component.totalProfit$ = of(25.2643724);

      // Act
      fixture.detectChanges();

      // Assert
      const element = fixture.debugElement.query(By.css('ion-card-content'));
      expect(element.classes['positive']).toBeTruthy();
    });
    it('should apply the "negative" css class for negative values', () => {
      // Arrange
      component.totalProfit$ = of(-25.2643724);

      // Act
      fixture.detectChanges();

      // Assert
      const element = fixture.debugElement.query(By.css('ion-card-content'));
      expect(element.classes['negative']).toBeTruthy();
    });
    it('should apply no css class for 0 value', () => {
      // Arrange
      component.totalProfit$ = of(0);

      // Act
      fixture.detectChanges();

      // Assert
      const element = fixture.debugElement.query(By.css('ion-card-content'));
      expect(element.classes['negative']).toBeUndefined(); //The class key will not appear in the KV object if it does not exist on the element.
      expect(element.classes['positive']).toBeUndefined();
    });
  });
});
