import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { CurrencyServiceComponent } from '../service/currency.service';

describe('CurrencyService', () => {

    let service: CurrencyServiceComponent;

    beforeEach(waitForAsync(() => {
        service = new CurrencyServiceComponent();
        service['currencySelected'] = 'EUR';
        TestBed.configureTestingModule({
            declarations: [CurrencyServiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    afterEach(() => {
        service.setCurrencySelected("EUR");
      });

    describe('getCurrencySelected()', () => {
        it('should return EUR as default value', () => {
            // Act
            var currency = service.getCurrencySelected();

            // Assert
            expect(currency).toEqual("EUR");
        });
        it('value returned corresponds to value from storage', () => {
            // Arrange
            service.setCurrencySelected("USD")

            // Act
            var currency = service.getCurrencySelected();

            // Assert
            expect(currency).toEqual("USD");
        });
    });

    describe('getCurrencySymbol()', () => {
        it('returns currency symbol corrensponing to string', () => {
            // Act
            var symbol = service.getCurrencySymbol();

            // Assert
            expect(symbol).toEqual("€");
        });
    });
});
