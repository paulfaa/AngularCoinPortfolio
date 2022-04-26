
import { HttpClient } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import * as moment from 'moment';
import StorageUtils from '../storage.utils';
import { Rate } from '../types/rate.type';
import { CoinServiceComponent } from './coin.service';
import { CurrencyServiceComponent } from './currency.service';
import { LoggingService } from './logging.service';

import { RateService } from './rate.service';

describe('RateService', () => {

    let serviceUnderTest: RateService;
    let coinService: CoinServiceComponent;
    let currencyService: CurrencyServiceComponent;
    let httpClient: HttpClient;
    let loggingService: LoggingService;
    let mockCurrencyService: jasmine.SpyObj<CurrencyServiceComponent>;
    let mockLoggingService: jasmine.SpyObj<LoggingService>;

    mockCurrencyService = jasmine.createSpyObj('mockCurrencyService', ['getCurrencySelected']);
    mockCurrencyService.getCurrencySelected.and.returnValue('EUR');
    mockLoggingService = jasmine.createSpyObj('mockCurrencyService', ['warn', 'info']);
    mockLoggingService.warn.and.returnValue(null);
    mockLoggingService.info.and.returnValue(null);

    const btcRateEur = new Rate("BTC", 500.25, "EUR", moment().toDate());
    const btcRateUsd = new Rate("BTC", 500.25, "USD", moment().toDate());

    beforeEach(waitForAsync(() => {
        serviceUnderTest = new RateService(coinService, mockCurrencyService, mockLoggingService, httpClient);
        serviceUnderTest['initService']();
        TestBed.configureTestingModule({
            declarations: [RateService]
        }).compileComponents();
    }));
    afterEach(() => {
	    serviceUnderTest['rates'] = [];
        StorageUtils.clearAllStorage();
  	});

    describe('getRateForTicker()', () => {
        it('should return 0 if no data for ticker', () => {
            // Act
            var response = serviceUnderTest.getRateForTicker("BTC");

            // Assert
            expect(response).toEqual(0);
        });
        it('should return the value for matching ticker + currency', () => {
            // Arrange
            serviceUnderTest['rates'].push(btcRateEur);

            // Act
            var response = serviceUnderTest.getRateForTicker("BTC");

            // Assert
            expect(response).toEqual(btcRateEur.value);
        });
        it('should return 0 for matching ticker and different currency', () => {
            // Arrange
            expect(serviceUnderTest['rates'].length).toEqual(0);
            serviceUnderTest['rates'].push(btcRateUsd);

            // Act
            var response = serviceUnderTest.getRateForTicker("BTC");

            // Assert
            expect(response).toEqual(0);
        });
    });

    describe('updateAllExchangeRates()', () => {
        it('will ignore all rates which have already been updated the past hour', () => {
            // Arrange
            var now = moment().toDate();
            btcRateEur.updated = now;
            serviceUnderTest['rates'].push(btcRateEur);

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            expect(serviceUnderTest['rates'][0].updated).toEqual(now);
        });
        it('will update all rates which are older than 1hr', () => {
            // Arrange
            var threeHoursAgo = moment().subtract(3, 'hour').toDate();
            btcRateEur.updated = threeHoursAgo;
            serviceUnderTest['rates'].push(btcRateEur);

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            expect(serviceUnderTest['rates'][0].updated > threeHoursAgo).toBeTrue;
        });
    });

    describe('getLastUpdateDate()', () => {
        it('will return the latest update date from all stored rates', () => {
            // Arrange
        });
    });
});