import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import * as moment from 'moment';
import { CurrencyEnum } from '../currencyEnum';
import { CoinService } from '../service/coin.service';
import StorageUtils from '../storage.utils';
import { Coin } from '../types/coin.type';
import { CoinName } from '../types/coinName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Value } from '../types/value.type';

describe('CoinService', () => {

    let service: CoinService;
    const testValue = new Value(299.542346, CurrencyEnum.EUR, moment().toDate());
    const coinName = new CoinName("BitCoin", "BTC");
    const purchaseDetails = new PurchaseDetails(250.55, CurrencyEnum.EUR, moment().toDate());
    const testCoin = new Coin(coinName, purchaseDetails, 0.75, testValue);

    beforeEach(waitForAsync(() => {
        service = new CoinService();
        service['currencySelected'] = 'EUR';
        TestBed.configureTestingModule({
            declarations: [CoinService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));
    afterEach(() => {
	    service['heldCoins'] = [];
        service['uniqueTickers'] = [];
        StorageUtils.clearAllStorage();
  	});

      describe('addCoin()', () => {
        it('adds the specified coin to the list', () => {
            // Arrange
            var coinsLength = service['heldCoins'].length;
            expect(coinsLength).toEqual(0);

            // Act
            service.addCoin(testCoin);
            var coinsLength = service.getAllHeldCoins().length;

            // Assert
            expect(coinsLength).toEqual(1);
        });
    });

    /* describe('addToHeldCoins()', () => {
        it('adds a coin with the passed parameters to the list', () => {
            // Arrange
            var coinsLength = service['heldCoins'].length;
            expect(coinsLength).toEqual(0);

            // Act
            service.addToHeldCoins("BTC", 12.34, 0.004); 
            var coinsLength = service.getAllHeldCoins().length;

            // Assert
            expect(coinsLength).toEqual(1);
        });
    }); */

    describe('clearAllHeldCoins()', () => {
        it('removes all coins from the list', () => {
            // Arrange
            service.addCoin(testCoin);
            var coinsLength = service['heldCoins'].length;
            expect(coinsLength).toEqual(1);

            // Act
            service.clearAllHeldCoins();
            coinsLength = service['heldCoins'].length;

            // Assert
            expect(coinsLength).toEqual(0);
        }); 
    });

    describe('removeFromHeldCoins()', () => {
        it('removes the passed value if it exists in held coins', () => {
            // Arrange
            service['heldCoins'].push(testCoin);
            expect(service['heldCoins'].length).toEqual(1);
            var addedCoins = service['heldCoins']
            expect(addedCoins[0]).toEqual(testCoin);

            // Act
            service.removeFromHeldCoins(testCoin);
            var coinsLength = service['heldCoins'].length;

            // Assert
            expect(coinsLength).toEqual(0);
        });
    });

    describe('getAmountHeldOfTicker()', () => {
        it('returns 0 if users owns none', () => {
            // Act
            expect(service['heldCoins'].length).toEqual(0);
            var amount = service.getAmountHeldOfTicker("ADA")

            // Assert
            expect(amount).toEqual(0);
        });
        it('returns total holdings of the passed ticker', () => {
            // Arrange
            const purchaseDetails = new PurchaseDetails(250.55, CurrencyEnum.EUR, moment().toDate());
            service.addToHeldCoins("ADA", purchaseDetails, 3.45);
            service.addToHeldCoins("ADA", purchaseDetails, 1.25);

            // Act
            var amount = service.getAmountHeldOfTicker("ADA")

            // Assert
            expect(amount).toEqual(4.70);
        });
    });

    describe('getAllUniqueTickers()', () => {
        it('returns empty list when no coins owned', () => {
            // Act
            expect
            var names = service.getAllUniqueTickers();

            // Assert
            expect(names.length).toEqual(0);
        });
        it('returns the ticker once for each unique coin', () => {
            // Arrange
            service.addToHeldCoins("BTC", purchaseDetails, 0.004);
            service.addToHeldCoins("BTC", purchaseDetails, 0.001);
            service.addToHeldCoins("ADA", purchaseDetails, 23.663);

            // Act
            var names = service.getAllUniqueTickers();

            // Assert
            expect(names.length).toEqual(2);
            expect(names.includes("BTC")).toBe(true);
        });
    });

    describe('getLastAddedDate()', () => {
        it('returns the most recent date from all owned coins', () => {
            // Arrange
            const oldDate = new Date(2011,1,1,11,11,0);
            const purchaseDetails = new PurchaseDetails(250.55, CurrencyEnum.EUR, oldDate);
            const oldCoin = new Coin(coinName, purchaseDetails, 5)
        
            service.addCoin(oldCoin);

            // Act
            var returnedDate = service.getLastAddedDate();

            // Assert
            expect(returnedDate).toEqual(oldDate);
            expect(service['lastAddedCoinDate']).toEqual(oldDate);
        });
        it('returns the most recent date from all owned coins2', () => {
            // Arrange
            const oldDate = new Date(2011,1,1,11,11,0);
            const purchaseDetails = new PurchaseDetails(250.55, CurrencyEnum.EUR, oldDate);
            const oldCoin = new Coin(coinName, purchaseDetails, 5)
            service.addCoin(oldCoin);
            service.addCoin(testCoin);

            // Act
            var returnedDate = service.getLastAddedDate();

            // Assert
            expect(returnedDate).toEqual(testCoin.purchaseDetails.date);
            expect(service['lastAddedCoinDate']).toEqual(testCoin.purchaseDetails.date);
        });
    });

});
