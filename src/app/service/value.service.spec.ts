import { HttpClient } from "@angular/common/http";
import { waitForAsync, TestBed } from "@angular/core/testing";
import * as moment from "moment";
import { CurrencyEnum } from "../currencyEnum";
import { Coin } from "../types/coin.type";
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
                new Coin("BitCoin", "BTC", 100, 1, value)
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
                new Coin("BitCoin", "BTC", 200, 1, value)
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
});