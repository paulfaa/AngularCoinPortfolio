import { HttpClient } from "@angular/common/http";
import { waitForAsync, TestBed } from "@angular/core/testing";
import { Coin } from "../types/coin.interface";
import { CoinService } from "./coin.service";
import { RateService } from "./rate.service";
import { ValueService } from "./value.service";

describe('ValueService', () => {

    let serviceUnderTest: ValueService;
    let mockCoinService: jasmine.SpyObj<CoinService>;
    let mockRateService: jasmine.SpyObj<RateService>;

    mockCoinService = jasmine.createSpyObj('mockCoinService', ['getAllHeldCoins']);
    mockRateService = jasmine.createSpyObj('mockRateService', ['methodName1']);

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

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(0);
        });
        it('should be able to deal with positive values', () => {
            // Arrange
            let coinList: Coin[] = [
                new Coin("BitCoin", "BTC", 100, 1, 200)
            ]
            mockCoinService.getAllHeldCoins.and.returnValue(coinList);

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(100);
        });
        it('should be able to deal with negative values', () => {
            // Arrange
            let coinList: Coin[] = [
                new Coin("BitCoin", "BTC", 200, 1, 100)
            ]
            mockCoinService.getAllHeldCoins.and.returnValue(coinList);

            // Act
            var result = serviceUnderTest.calculateTotalProfit();

            // Assert
            expect(result).toEqual(-100);
        });
    });
});