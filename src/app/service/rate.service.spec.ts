
import { HttpClient } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import * as moment from 'moment';
import { CurrencyEnum } from '../currencyEnum';
import StorageUtils from '../storage.utils';
import { Rate } from '../types/rate.type';
import { PurchasesService } from './purchases.service';
import { CurrencyService } from './currency.service';
import { LoggingService } from './logging.service';

import { RateService } from './rate.service';
import { CryptoValueClientService } from './crypto-value-client.service';

describe('RateService', () => {

    let serviceUnderTest: RateService;
    let coinService: PurchasesService;
    let currencyService: CurrencyService;
    let cryptoValueClientService: CryptoValueClientService;
    let loggingService: LoggingService;
    let mockCurrencyService: jasmine.SpyObj<CurrencyService>;
    let mockLoggingService: jasmine.SpyObj<LoggingService>;

    mockCurrencyService = jasmine.createSpyObj('mockCurrencyService', ['getCurrencySelected']);
    mockCurrencyService.getSelectedCurrency.and.returnValue(CurrencyEnum.EUR);
    mockLoggingService = jasmine.createSpyObj('mockCurrencyService', ['warn', 'info']);
    mockLoggingService.warn.and.returnValue(null);
    mockLoggingService.info.and.returnValue(null);

    const btcRateEur = new Rate("BTC", 500.25, CurrencyEnum.EUR, moment().toDate());
    const btcRateUsd = new Rate("BTC", 500.25, CurrencyEnum.USD, moment().toDate());

    beforeEach(waitForAsync(() => {
        serviceUnderTest = new RateService(coinService, mockCurrencyService, mockLoggingService, cryptoValueClientService);
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
            btcRateEur.updateDate = now;
            serviceUnderTest['rates'].push(btcRateEur);

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            expect(serviceUnderTest['rates'][0].updateDate).toEqual(now);
        });
        it('will update all rates which are older than 1hr', () => {
            // Arrange
            var threeHoursAgo = moment().subtract(3, 'hour').toDate();
            btcRateEur.updateDate = threeHoursAgo;
            serviceUnderTest['rates'].push(btcRateEur);

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            expect(serviceUnderTest['rates'][0].updateDate > threeHoursAgo).toBeTrue;
        });
    });

    describe('getLastUpdateDate()', () => {
        it('will return the latest update date from all stored rates', () => {
            // Arrange
        });
    });
});