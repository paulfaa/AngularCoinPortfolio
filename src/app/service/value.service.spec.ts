import { HttpClient, HttpClientModule } from "@angular/common/http";
import { waitForAsync, TestBed } from "@angular/core/testing";
import * as moment from "moment";
import { CurrencyEnum } from "../currencyEnum";
import { CoinBuilder } from "../types/coin.builder";
import { Coin } from "../types/coin.type";
import { CoinName } from "../types/coinName.type";
import { PurchaseDetails } from "../types/purchaseDetails.type";
import { Rate } from "../types/rate.type";
import { Value } from "../types/value.type";
import { CoinService } from "./coin.service";
import { CurrencyService } from "./currency.service";
import { RateService } from "./rate.service";
import { ValueService } from "./value.service";

describe('ValueService', () => {

    let serviceUnderTest: ValueService;
    let mockCoinService: jasmine.SpyObj<CoinService>;
    let mockRateService: jasmine.SpyObj<RateService>;
    let mockCurrencyService: jasmine.SpyObj<CurrencyService>;

    mockCoinService = jasmine.createSpyObj('mockCoinService', ['getAllHeldCoins', 'getAllUniqueTickers', 'getAmountHeldOfTicker']);
    mockRateService = jasmine.createSpyObj('mockRateService', ['updateAllExchangeRates', 'getRateForTicker']);
    mockCurrencyService = jasmine.createSpyObj('mockCurrencyService', ['getCurrencySelected']);

    const coinName = new CoinName("BitCoin", "BTC");

    beforeEach(waitForAsync(() => {
        serviceUnderTest = new ValueService(mockCoinService, mockRateService, mockCurrencyService);
        TestBed.configureTestingModule({
            declarations: [RateService],
            imports: [HttpClientModule]
        }).compileComponents();
    }));

    describe('calculateTotalValue()', () => {
        it('should return 0 if no coins are owned', () => {
            // Arrange
            mockCoinService.getAllHeldCoins.and.returnValue(null);
            mockCoinService.getAllUniqueTickers.and.returnValue(null);
            mockRateService.updateAllExchangeRates.and.returnValue(null);

            // Act
            var result = serviceUnderTest.calculateTotalValue();

            // Assert
            expect(result).toEqual(0);
        });
        it('should return the total value of all coins owned', () => {
            // Arrange
            const sampleCoins: Coin[] = [
                new CoinBuilder()
                .id(12)
                .name(new CoinName("Cardano", "ADA"))
                .purchaseDetails(new PurchaseDetails(5, CurrencyEnum.EUR, new Date()))
                .quantity(5)
                .value(new Value(15, CurrencyEnum.EUR, new Date()))
                .build(),
                new CoinBuilder()
                .id(12)
                .name(new CoinName("Cardano", "ADA"))
                .purchaseDetails(new PurchaseDetails(10, CurrencyEnum.EUR, new Date()))
                .quantity(1)
                .value(new Value(15, CurrencyEnum.EUR, new Date()))
                .build()
            ];
            mockCoinService.getAllHeldCoins.and.returnValue(sampleCoins);
            mockCoinService.getAllUniqueTickers.and.returnValue(["ADA"]);
            mockCoinService.getAmountHeldOfTicker.and.returnValue(6);
            mockRateService.getRateForTicker.and.returnValue(15);
            mockRateService.updateAllExchangeRates.and.returnValue(null);

            // Act
            var result = serviceUnderTest.calculateTotalValue();

            // Assert
            expect(result).toEqual(90);
        });
    });

    describe('calculateTotalProfit()', () => {
        it('should return 0 no coins are owned', () => {
            // Arrange
            mockCoinService.getAllHeldCoins.and.returnValue(null);
            mockCoinService.getAllUniqueTickers.and.returnValue(null);
            mockRateService.updateAllExchangeRates.and.returnValue(null);

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(0);
        });
        it('should be able to deal with positive values', () => {
            // Arrange
            const value = new Value(200, CurrencyEnum.EUR, moment().toDate())
            const purchaseDetails = new PurchaseDetails(100, CurrencyEnum.EUR, moment().toDate());
            let coinList: Coin[] = [
                new Coin(coinName, purchaseDetails, 1, value)
            ]
            mockCoinService.getAllHeldCoins.and.returnValue(coinList);
            mockCoinService.getAllUniqueTickers.and.returnValue(["EUR"]);
            mockCoinService.getAmountHeldOfTicker.and.returnValue(1);
            mockRateService.updateAllExchangeRates.and.returnValue(null);
            mockRateService.getRateForTicker.and.returnValue(200);

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(100);
        });
        it('should be able to deal with negative values', () => {
            // Arrange
            const value = new Value(-100, CurrencyEnum.EUR, moment().toDate())
            const purchaseDetails = new PurchaseDetails(200, CurrencyEnum.EUR, moment().toDate());
            let coinList: Coin[] = [
                new Coin(coinName, purchaseDetails, 1, value)
            ]
            mockCoinService.getAllHeldCoins.and.returnValue(coinList);
            mockCoinService.getAllUniqueTickers.and.returnValue(["EUR"]);
            mockCoinService.getAmountHeldOfTicker.and.returnValue(1);
            mockRateService.updateAllExchangeRates.and.returnValue(null);
            mockRateService.getRateForTicker.and.returnValue(-100);;

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(-300);
        });
    });

    describe('updateValueForSingleCoin()', () => {
        it('updates the value for a single held coin', () => {
            // Arrange
            const value1 = new Value(200, CurrencyEnum.EUR, moment().toDate())
            const value2 = new Value(200, CurrencyEnum.EUR, moment().toDate())
            const purchaseDetails1 = new PurchaseDetails(100, CurrencyEnum.EUR, moment().toDate());
            const purchaseDetails2 = new PurchaseDetails(120, CurrencyEnum.EUR, moment().toDate());
            const newRate = new Rate("BTC", 200, CurrencyEnum.EUR, moment().toDate());
            let coinList: Coin[] = [
                new Coin(coinName, purchaseDetails1, 1, value1),
                new Coin(coinName, purchaseDetails2, 1, value2)
            ]
            mockCoinService.getAllHeldCoins.and.returnValue(coinList);
            mockCoinService.getAllUniqueTickers.and.returnValue(["BTC"]);
            mockRateService.getRateForTicker.and.returnValue(500);
            mockRateService.updateAllExchangeRates.and.returnValue(null);

            // Act
            serviceUnderTest.updateValueForSingleCoin(coinList[0]);
            var result = mockCoinService.getAllHeldCoins();

            // Assert
            expect(result[0].value.getCurrentValue()).toEqual(500);
        });
    });

});