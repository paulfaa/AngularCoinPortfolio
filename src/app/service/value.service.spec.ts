import { HttpClient } from "@angular/common/http";
import { waitForAsync, TestBed } from "@angular/core/testing";
import * as moment from "moment";
import { CurrencyEnum } from "../currencyEnum";
import { Coin } from "../types/coin.type";
import { CoinName } from "../types/coinName.type";
import { Rate } from "../types/rate.type";
import { Value } from "../types/value.type";
import { CoinService } from "./coin.service";
import { RateService } from "./rate.service";
import { ValueService } from "./value.service";

describe('ValueService', () => {

    let serviceUnderTest: ValueService;
    let mockCoinService: jasmine.SpyObj<CoinService>;
    let mockRateService: jasmine.SpyObj<RateService>;

    mockCoinService = jasmine.createSpyObj('mockCoinService', ['getAllHeldCoins', 'getAllUniqueTickers', 'getAmountHeldOfTicker']);
    mockRateService = jasmine.createSpyObj('mockRateService', ['updateAllExchangeRates', 'getRateForTicker']);

    const coinName = new CoinName("BitCoin", "BTC");

    beforeEach(waitForAsync(() => {
        serviceUnderTest = new ValueService(mockCoinService, mockRateService);
        TestBed.configureTestingModule({
            declarations: [RateService]
        }).compileComponents();
    }));

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
            let coinList: Coin[] = [
                new Coin(coinName, 100, 1, value)
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
            let coinList: Coin[] = [
                new Coin(coinName, 200, 1, value)
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
            const newRate = new Rate("BTC", 200, CurrencyEnum.EUR, moment().toDate());
            let coinList: Coin[] = [
                new Coin(coinName, 100, 1, value1),
                new Coin(coinName, 120, 1, value2)
            ]
            mockCoinService.getAllHeldCoins.and.returnValue(coinList);
            mockCoinService.getAllUniqueTickers.and.returnValue(["BTC"]);
            mockRateService.updateAllExchangeRates.and.returnValue(null);

            // Act
            serviceUnderTest.updateValueForSingleCoin(coinList[0]);
            var result = mockCoinService.getAllHeldCoins();

            // Assert
            expect(result[0].value.getCurrentValue()).toEqual(500);
        });
    });

});