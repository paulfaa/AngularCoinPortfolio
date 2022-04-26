import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { CurrencyEnum } from '../currencyEnum';
import { CurrencyService } from '../service/currency.service';

describe('CurrencyService', () => {

    let service: CurrencyService;

    beforeEach(waitForAsync(() => {
        service = new CurrencyService();
        service['currencySelected'] = CurrencyEnum.EUR;
        localStorage.setItem("currencySelected", "EUR");
        TestBed.configureTestingModule({
            declarations: [CurrencyService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    afterEach(() => {
        service.setCurrencySelected(CurrencyEnum.EUR);
      });

    describe('getCurrencySelected()', () => {
        it('should return EUR as default value', () => {
            // Act
            var currency = service.getCurrencySelected();

            // Assert
            expect(CurrencyEnum[currency].toString()).toEqual("EUR");
        });
        it('value returned corresponds to value from storage', () => {
            // Arrange
            service.setCurrencySelected(CurrencyEnum.USD)

            // Act
            var currency = service.getCurrencySelected();

            // Assert
            expect(currency.toString()).toEqual("USD");
        });
    });

    describe('getCurrencySymbol()', () => {
        it('returns currency symbol corresponding to string', () => {
            // Act
            var symbol = service.getCurrencySymbol();

            // Assert
            expect(symbol).toEqual("€");
        });
    });
});
