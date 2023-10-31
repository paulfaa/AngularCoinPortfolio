import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { CurrencyEnum } from '../types/currencyEnum';
import { CurrencyService } from '../service/currency.service';
import { of } from 'rxjs';

describe('CurrencyService', () => {

    let service: CurrencyService;

    beforeEach(waitForAsync(() => {
        service = new CurrencyService();
        service['currencySubject'].next(CurrencyEnum.EUR);
        localStorage.setItem("currencySelected", "EUR");
        TestBed.configureTestingModule({
            declarations: [CurrencyService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    afterEach(() => {
        service.setSelectedCurrency(CurrencyEnum.EUR);
      });

    describe('getCurrencySelected()', () => {
        it('should return EUR as default value', () => {
            // Act
            var currency = service.getSelectedCurrency();

            //Assert
            expect(currency).toEqual(of(CurrencyEnum.EUR));
        });
        it('value returned corresponds to value from storage', () => {
            // Arrange
            service.setSelectedCurrency(CurrencyEnum.USD)

            // Act
            var currency = service.getSelectedCurrency();

            // Assert
            expect(currency.toString()).toEqual("USD");
        });
    });
});
