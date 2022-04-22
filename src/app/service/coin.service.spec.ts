import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import * as moment from 'moment';
import { CoinServiceComponent } from '../service/coin.service';
import { Coin } from '../types/coin.interface';

describe('CoinService', () => {

    let service: CoinServiceComponent;
    const testCoin = new Coin("Bitcoin", "BTC", 250.55, 0.75, 299.54)
    testCoin.purchaseDate = moment().toDate();

    beforeEach(waitForAsync(() => {
        service = new CoinServiceComponent();
        service['currencySelected'] = 'EUR';
        service['heldCoins'] = null;
        service.checkListState();
        TestBed.configureTestingModule({
            declarations: [CoinServiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    describe('addToHeldCoins()', () => {
        it('adds a coin with the passed parameters to the list', () => {
            // Arrange
            var coinsLength = service.getAllHeldCoins().length;
            expect(coinsLength).toEqual(0);

            // Act
            service.addToHeldCoins("BTC", 12.34, 0.004); 
            var coinsLength = service.getAllHeldCoins().length;

            // Assert
            expect(coinsLength).toEqual(1);
        });
    });

    describe('clearAllHeldCoins()', () => {
        it('removes all coins from the list', () => {
            // Arrange
            service.addToHeldCoins("BTC", 12.34, 0.004);
            var coinsLength = service.getAllHeldCoins().length;
            expect(coinsLength).toEqual(1);

            // Act
            service.clearAllHeldCoins();
            coinsLength = service.getAllHeldCoins().length;

            // Assert
            expect(coinsLength).toEqual(1);
        }); 
    });

    describe('removeFromHeldCoins()', () => {
        it('removes the passed value if it exists in held coins', () => {
            // Arrange
            service['heldCoins'].push(testCoin);
            expect(service['heldCoins'])[0].toEqual(testCoin);

            // Act
            service.removeFromHeldCoins(testCoin);
            var coinsLength = service['heldCoins'].length.toFixed;

            // Assert
            expect(coinsLength).toEqual(0);
        });
    });

    describe('getAmountHeldOfTicker()', () => {
        it('returns 0 if users owns none', () => {
            // Act
            var amount = service.getAmountHeldOfTicker("ADA")

            // Assert
            expect(amount).toEqual(0);
        });
        it('returns total holdings of the passed ticker', () => {
            // Arrange
            service.addToHeldCoins("ADA", 0, 3.45);
            service.addToHeldCoins("ADA", 0, 1.25);

            // Act
            var amount = service.getAmountHeldOfTicker("ADA")

            // Assert
            expect(amount).toEqual(4.70);
        });
    });

    describe('getAllUniqueTickers()', () => {
        it('returns empty list when no coins owned', () => {
            // Act
            var names = service.getAllUniqueTickers();

            // Assert
            expect(names.length).toEqual(0);
        });
        it('returns the ticker once for each unique coin', () => {
            // Arrange
            service.addToHeldCoins("BTC", 12.34, 0.004);
            service.addToHeldCoins("BTC", 1.45, 0.001);
            service.addToHeldCoins("ADA", 15, 23.663);

            // Act
            var names = service.getAllUniqueTickers();

            // Assert
            expect(names.length).toEqual(2);
            expect(names.includes("BTC")).toBe(true);
        });
    });

    describe('getLastAddedDate()', () => {
        it('returns the most recent date from all owned coins', () => {
            // Act
        });
    });

});
