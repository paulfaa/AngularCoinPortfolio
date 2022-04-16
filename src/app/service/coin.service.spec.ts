import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { CoinServiceComponent } from '../service/coin.service';
import { Coin } from '../types/coin.interface';

describe('CoinService', () => {

    let service: CoinServiceComponent;
    const testCoin = new Coin("Bitcoin", "BTC", 250.55, 0.75, 299.54)

    beforeEach(waitForAsync(() => {
        service = new CoinServiceComponent();
        service['currencySelected'] = 'EUR';
        service.checkListState();
        TestBed.configureTestingModule({
            declarations: [CoinServiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

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
});
