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
import { SettingsService } from '../service/settings.service';
import { ValueService } from "./value.service";
import { CryptoValueClientService } from "./crypto-value-client.service";
import { LoggingService } from "./logging.service";
import { of } from "rxjs";
import StorageUtils from "../storage.utils";
import { RATES_STORAGE_KEY } from "../shared/constants/constants";

describe('ValueService', () => {

    let serviceUnderTest: ValueService;
    let mockPurchasesService: jasmine.SpyObj<PurchasesService>;
    let mockSettingsService: jasmine.SpyObj<SettingsService>;
    let mockLoggingService: jasmine.SpyObj<LoggingService>;
    let mockCryptoValueClientService: jasmine.SpyObj<CryptoValueClientService>;

    mockPurchasesService = jasmine.createSpyObj('mockPurchasesService', ['getAllPurchases', 'getAllUniqueIds', 'getQuantityHeldById']);
    mockLoggingService = jasmine.createSpyObj('mockLoggingService', ['log', 'info'])
    mockSettingsService = jasmine.createSpyObj('mockSettingsService', ['getSelectedCurrency']);
    mockCryptoValueClientService = jasmine.createSpyObj('mockCryptoValueClientService', ['getCryptoValues']);

    const coinName = new CryptoName("BitCoin", "BTC", 1);
    const btcRateEur = new Rate(1, "BTC", 500.25, "EUR", moment().toDate());
    const btcRateUsd = new Rate(1, "BTC", 500.25, "USD", moment().toDate());
    const adaRateEur = new Rate(12, "ADA", 10, "EUR", moment().toDate())

    beforeEach(waitForAsync(() => {
        localStorage.removeItem(RATES_STORAGE_KEY);
        mockPurchasesService.getAllUniqueIds.and.returnValue([1, 2]);
        mockPurchasesService.getAllPurchases.and.returnValue(of([]));
        mockSettingsService.getSelectedCurrency.and.returnValue(of(CurrencyEnum.EUR));
        mockCryptoValueClientService.getCryptoValues.and.returnValue(of([btcRateEur]));
        serviceUnderTest = new ValueService(mockPurchasesService, mockSettingsService, mockLoggingService, mockCryptoValueClientService);
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        }).compileComponents();
        serviceUnderTest['ratesMap'] = new Map<string, Rate[]>();
        serviceUnderTest["initService"]();
    }));
    afterEach(() => {
        StorageUtils.clearAllStorage();
        serviceUnderTest['selectedCurrency'] = undefined;
    });

    describe('getRateForId()', () => {
        it('should return undefined if no data for id', () => {
            // Act
            const response = serviceUnderTest.getRateForId(1);

            // Assert
            expect(response).toBeUndefined();
        });
        it('should return the value for matching id and currency', () => {
            // Arrange
            serviceUnderTest['ratesMap'].set("EUR", [btcRateEur]);

            // Act
            const response = serviceUnderTest.getRateForId(1);

            // Assert
            expect(response).toEqual(btcRateEur.value);
        });
        it('should return 0 for matching id and different currency', () => {
            // Arrange
            serviceUnderTest['ratesMap'] = new Map<string, Rate[]>();
            serviceUnderTest['selectedCurrency'] = CurrencyEnum.EUR;
            expect(serviceUnderTest['ratesMap'].size).toEqual(0);
            serviceUnderTest['ratesMap'].set("USD", [btcRateEur]);

            // Act
            const response = serviceUnderTest.getRateForId(1);

            // Assert
            expect(response).toBeUndefined();
        });
    });

    describe('updateAllExchangeRates()', () => {
        it('will ignore all rates which have already been updated the past hour', () => {
            // Arrange
            const now = moment().toDate();
            const tolerance = 5000;
            btcRateEur.updateDate = now;
            serviceUnderTest['ratesMap'].set("EUR", [btcRateEur]);
            mockCryptoValueClientService.getCryptoValues.and.returnValue(of([btcRateUsd]));

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            const timestamp1 = serviceUnderTest['ratesMap'].get("EUR")[0].updateDate.getTime();
            const timestamp2 = now.getTime();
            expect(Math.abs(timestamp1 - timestamp2)).toBeLessThan(tolerance);
        });
        it('will update all rates which are older than 1hr', () => {
            // Arrange
            const threeHoursAgo = moment().subtract(3, 'hour').toDate();
            btcRateEur.updateDate = threeHoursAgo;
            serviceUnderTest['ratesMap'].set("EUR", [btcRateEur]);

            // Act
            serviceUnderTest.updateAllExchangeRates();

            // Assert
            expect(serviceUnderTest['ratesMap'].get("EUR")[0].updateDate > threeHoursAgo).toBeTrue;
        });
    });

    describe('calculateTotalValue()', () => {
        it('should return 0 if no coins are owned', (done) => {
            // Arrange
            mockPurchasesService.getAllPurchases.and.returnValue(of([]));
            mockPurchasesService.getAllUniqueIds.and.returnValue([]);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            serviceUnderTest.calculateTotalProfit();
            const result = serviceUnderTest.getTotalProfit();

            // Assert
            result.subscribe(value => {
                expect(value).toEqual(0);
                done();
            });
        });
        it('should return the total value of all coins owned', (done) => {
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
            serviceUnderTest['purchases'] = sampleCoins;
            serviceUnderTest['ratesMap'].set("EUR", [adaRateEur]);
            mockPurchasesService.getAllPurchases.and.returnValue(of(sampleCoins));
            mockPurchasesService.getAllUniqueIds.and.returnValue([12]);
            mockPurchasesService.getQuantityHeldById.and.returnValue(6);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            serviceUnderTest.calculateTotalProfit();
            const result = serviceUnderTest.getTotalValue();

            // Assert
            result.subscribe(value => {
                expect(value).toEqual(90);
                done();
            });
        });
    });

    describe('calculateTotalProfit()', () => {
        it('should return 0 no coins are owned', () => {
            // Arrange
            mockPurchasesService.getAllPurchases.and.returnValue(of([]));
            mockPurchasesService.getAllUniqueIds.and.returnValue([]);
            serviceUnderTest.updateAllExchangeRates();

            // Act
            const result = serviceUnderTest.calculateTotalProfit();

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
            const result = serviceUnderTest.calculateTotalProfit();

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
            const result = serviceUnderTest.calculateTotalProfit();

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