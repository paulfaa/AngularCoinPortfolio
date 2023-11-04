import { HttpClientModule } from "@angular/common/http";
import { waitForAsync, TestBed } from "@angular/core/testing";
import * as moment from "moment";
import { CurrencyEnum } from "../types/currencyEnum";
import { CryptoPurchaseBuilder } from "../types/cryptoPurchase.builder";
import { CryptoPurchase } from "../types/cryptoPurchase.type";
import { CryptoName } from "../types/cryptoName.type";
import { PurchaseDetails } from "../types/purchaseDetails.type";
import { Rate } from "../types/rate.type";
import { Value } from "../types/value.type";
import { PurchasesService } from "./purchases.service";
import { CurrencyService } from "./currency.service";
import { ValueService } from "./value.service";
import { CryptoValueClientService } from "./crypto-value-client.service";
import { LoggingService } from "./logging.service";
import { of } from "rxjs";
import StorageUtils from "../storage.utils";

describe('ValueService', () => {

    let serviceUnderTest: ValueService;
    let mockPurchasesService: jasmine.SpyObj<PurchasesService>;
    let mockCurrencyService: jasmine.SpyObj<CurrencyService>;
    let mockLoggingService: jasmine.SpyObj<LoggingService>;
    let mockCryptoValueClientService: jasmine.SpyObj<CryptoValueClientService>;

    mockPurchasesService = jasmine.createSpyObj('mockCoinService', ['getAllPurchases', 'getAllUniqueIds', 'getQuantityHeldById']);
    mockLoggingService = jasmine.createSpyObj('mockLoggingService', ['log'])
    mockCurrencyService = jasmine.createSpyObj('mockCurrencyService', ['getSelectedCurrency']);
    mockCryptoValueClientService = jasmine.createSpyObj('mockCryptoValueClientService', ['getCryptoValues']);

    const coinName = new CryptoName("BitCoin", "BTC", 1);
    const btcRateEur = new Rate(1, "BTC", 500.25, CurrencyEnum.EUR, moment().toDate());
    const btcRateUsd = new Rate(1, "BTC", 500.25, CurrencyEnum.USD, moment().toDate());

    beforeEach(waitForAsync(() => {
        mockPurchasesService.getAllUniqueIds.and.returnValue([1,2]);
        mockCurrencyService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
        mockCryptoValueClientService.getCryptoValues.and.returnValue(of([btcRateEur]));
        serviceUnderTest = new ValueService(mockPurchasesService, mockCurrencyService, mockLoggingService, mockCryptoValueClientService);
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        }).compileComponents();
        serviceUnderTest['ratesMap'] = new Map<string, Rate[]>();
        serviceUnderTest["initService"]();
    }));
    afterEach(() => {
        StorageUtils.clearAllStorage();
  	});

    describe('getRateForId()', () => {
        it('should return 0 if no data for id', () => {
            // Act
            var response = serviceUnderTest.getRateForId(1);

            // Assert
            expect(response).toBeUndefined;
        });
        it('should return the value for matching ticker + currency', () => {
            // Arrange
            serviceUnderTest['ratesMap'].set("EUR", [btcRateEur]);

            // Act
            var response = serviceUnderTest.getRateForId(1);

            // Assert
            expect(response).toEqual(btcRateEur.value);
        });
        it('should return 0 for matching ticker and different currency', () => {
            // Arrange
            expect(serviceUnderTest['ratesMap'].size).toEqual(0);
            serviceUnderTest['ratesMap'].set("USD", [btcRateEur]);

            // Act
            var response = serviceUnderTest.getRateForId(1);

            // Assert
            expect(response).toBeUndefined;
        });
    });

    describe('updateAllExchangeRates()', () => {
        it('will ignore all rates which have already been updated the past hour', () => {
            // Arrange
            var now = moment().toDate();
            btcRateEur.updateDate = now;
            serviceUnderTest['ratesMap'].set("EUR", [btcRateEur]);
            mockCryptoValueClientService.getCryptoValues.and.returnValue(of([btcRateUsd]));

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            expect(serviceUnderTest['ratesMap'].get("EUR")[0].updateDate).toEqual(now);
        });
        it('will update all rates which are older than 1hr', () => {
            // Arrange
            var threeHoursAgo = moment().subtract(3, 'hour').toDate();
            btcRateEur.updateDate = threeHoursAgo;
            serviceUnderTest['ratesMap'].set("EUR", [btcRateEur]);

            // Act
            serviceUnderTest.updateAllExchangeRates(); 

            // Assert
            expect(serviceUnderTest['ratesMap'].get("EUR")[0].updateDate > threeHoursAgo).toBeTrue;
        });
    });

    describe('calculateTotalValue()', () => {
        it('should return 0 if no coins are owned', () => {
            // Arrange
            mockPurchasesService.getAllPurchases.and.returnValue(null);
            mockPurchasesService.getAllUniqueIds.and.returnValue(null);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            serviceUnderTest.calculateTotalProfit();
            var result = serviceUnderTest.getTotalProfit();

            // Assert
            expect(result).toEqual(of(0));
        });
        it('should return the total value of all coins owned', () => {
            // Arrange
            const sampleCoins: CryptoPurchase[] = [
                new CryptoPurchaseBuilder()
                .name(new CryptoName("Cardano", "ADA", 12))
                .purchaseDetails(new PurchaseDetails(5, CurrencyEnum.EUR, new Date()))
                .quantity(5)
                .value(new Value(15, CurrencyEnum.EUR, new Date()))
                .build(),
                new CryptoPurchaseBuilder()
                .name(new CryptoName("Cardano", "ADA", 12))
                .purchaseDetails(new PurchaseDetails(10, CurrencyEnum.EUR, new Date()))
                .quantity(1)
                .value(new Value(15, CurrencyEnum.EUR, new Date()))
                .build()
            ];
            mockPurchasesService.getAllPurchases.and.returnValue(of(sampleCoins));
            mockPurchasesService.getAllUniqueIds.and.returnValue([12]);
            mockPurchasesService.getQuantityHeldById.and.returnValue(6);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            serviceUnderTest.calculateTotalProfit();
            var result = serviceUnderTest.getTotalValue();

            // Assert
            expect(result).toEqual(of(90));
        });
    });

    describe('calculateTotalProfit()', () => {
        it('should return 0 no coins are owned', () => {
            // Arrange
            mockPurchasesService.getAllPurchases.and.returnValue(of([]));
            mockPurchasesService.getAllUniqueIds.and.returnValue([]);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(0);
        });
        it('should be able to deal with positive values', () => {
            // Arrange
            const value = new Value(200, CurrencyEnum.EUR, moment().toDate())
            const purchaseDetails = new PurchaseDetails(100, CurrencyEnum.EUR, moment().toDate());
            let coinList: CryptoPurchase[] = [
                new CryptoPurchase(coinName, purchaseDetails, 1, value)
            ]
            mockPurchasesService.getAllPurchases.and.returnValue(of(coinList));
            mockPurchasesService.getAllUniqueIds.and.returnValue([1]);
            mockPurchasesService.getQuantityHeldById.and.returnValue(1);
            serviceUnderTest.updateAllExchangeRates();
            //mockRateService.getRateForTicker.and.returnValue(200);

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(100);
        });
        it('should be able to deal with negative values', () => {
            // Arrange
            const value = new Value(0, CurrencyEnum.EUR, moment().toDate()) //value of holding cant be less than 0
            const purchaseDetails = new PurchaseDetails(200, CurrencyEnum.EUR, moment().toDate());
            let coinList: CryptoPurchase[] = [
                new CryptoPurchase(coinName, purchaseDetails, 1, value)
            ]
            mockPurchasesService.getAllPurchases.and.returnValue(of(coinList));
            mockPurchasesService.getAllUniqueIds.and.returnValue([1]);
            mockPurchasesService.getQuantityHeldById.and.returnValue(1);
            serviceUnderTest.updateAllExchangeRates();
            //mockRateService.getRateForTicker.and.returnValue(-100);;

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(0);
        });
    });

    /* describe('updateValueForSingleCoin()', () => {
        it('updates the value for a single held coin', () => {
            // Arrange
            const value1 = new Value(200, CurrencyEnum.EUR, moment().toDate())
            const value2 = new Value(200, CurrencyEnum.EUR, moment().toDate())
            const purchaseDetails1 = new PurchaseDetails(100, CurrencyEnum.EUR, moment().toDate());
            const purchaseDetails2 = new PurchaseDetails(120, CurrencyEnum.EUR, moment().toDate());
            const newRate = new Rate(1, "BTC", 200, CurrencyEnum.EUR, moment().toDate());
            let coinList: CryptoPurchase[] = [
                new CryptoPurchase(coinName, purchaseDetails1, 1, value1),
                new CryptoPurchase(coinName, purchaseDetails2, 1, value2)
            ]
            mockPurchasesService.getAllPurchases.and.returnValue(of(coinList));
            mockPurchasesService.getAllUniqueTickers.and.returnValue(["BTC"]);
            mockRateService.getRateForTicker.and.returnValue(500);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            serviceUnderTest.up(coinList[0]);
            var result = mockPurchasesService.getAllPurchases();

            // Assert
            expect(result[0].value.getCurrentValue()).toEqual(500);
        });
    }); */
});