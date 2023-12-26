import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { CurrencyEnum } from '../types/currencyEnum';
import { PurchasesService } from './purchases.service';
import { CryptoName } from '../types/cryptoName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Value } from '../types/value.type';
import { CryptoPurchaseBuilder } from '../types/cryptoPurchase.builder';
import StorageUtils from '../storage.utils';
import { SettingsService } from './settings.service';
import { Currency } from '../types/currency.type';

describe('PurchasesService', () => {

    let service: PurchasesService;
    let mockSettingsService: jasmine.SpyObj<SettingsService>;

    mockSettingsService = jasmine.createSpyObj('mockSettingsService', []);

    const purchase1 = new CryptoPurchaseBuilder()
        .name(new CryptoName("Bitcoin", "BTC", 1))
        .purchaseDetails(new PurchaseDetails(5, new Currency("EUR", "€"), new Date()))
        .quantity(5)
        .value(new Value(15, new Currency("EUR", "€"), new Date()))
        .build();
    const purchase2 = new CryptoPurchaseBuilder()
        .name(new CryptoName("Bitcoin", "BTC", 1))
        .purchaseDetails(new PurchaseDetails(5, new Currency("EUR", "€"), new Date()))
        .quantity(10)
        .value(new Value(30, new Currency("EUR", "€"), new Date()))
        .build();
    const purchase3 = new CryptoPurchaseBuilder()
        .name(new CryptoName("Cardano", "ADA", 12))
        .purchaseDetails(new PurchaseDetails(10, new Currency("EUR", "€"), new Date()))
        .quantity(1)
        .value(new Value(5, new Currency("EUR", "€"), new Date()))
        .build()

    beforeEach(waitForAsync(() => {
        service = new PurchasesService(mockSettingsService);
        service['currencySelected'] = 'EUR';
        TestBed.configureTestingModule({
            declarations: [PurchasesService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]

        }).compileComponents();
    }));
    afterEach(() => {
	    service.clearAllPurchases();
        service['purchasesSubject'].next([]);
        StorageUtils.clearAllStorage();
  	});

      describe('addPurchase()', () => {
        it('adds the specified purchase to the list', () => {
            // Arrange
            var purchases = service['purchasesSubject'].getValue().length;
            expect(purchases).toEqual(0);

            // Act
            service.addPurchase(purchase1);
            var purchasesLength = service.getAllPurchases().subscribe.length;

            // Assert
            expect(purchasesLength).toEqual(1);
        });
    });

    describe('clearAllPurchases()', () => {
        it('removes all coins from the list', () => {
            // Arrange
            service.addPurchase(purchase1);
            var purchasesLength = service['purchasesSubject'].getValue().length;
            expect(purchasesLength).toEqual(1);

            // Act
            service.clearAllPurchases();
            purchasesLength = service['purchasesSubject'].getValue().length;

            // Assert
            expect(purchasesLength).toEqual(0);
        }); 
    });

    describe('removeFromHeldCoins()', () => {
        it('removes the passed value if it exists in held coins', () => {
            // Arrange
            service.addPurchase(purchase1);
            expect(service['purchasesSubject'].getValue().length).toEqual(1);
            const purchases = service['purchasesSubject'].getValue();
            expect(purchases[0]).toEqual(purchase1);

            // Act
            service.removePurchase(purchase1);
            const purchasesLength = service['purchasesSubject'].getValue().length;

            // Assert
            expect(purchasesLength).toEqual(0);
        });
    });

    describe('getQuantityHeldById()', () => {
        it('returns 0 if users owns none', () => {
            // Act
            expect(service['purchasesSubject'].getValue().length).toEqual(0);
            var amount = service.getQuantityHeldById(23)

            // Assert
            expect(amount).toEqual(0);
        });
        it('returns total holdings of the passed id', () => {
            // Arrange
            service.addPurchase(purchase1);
            service.addPurchase(purchase2);

            // Act
            var amount = service.getQuantityHeldById(1)

            // Assert
            expect(amount).toEqual(15);
        });
    });

    describe('getAllUniqueIds()', () => {
        it('returns empty list when no coins owned', () => {
            // Act
            const ids = service.getAllUniqueIds();

            // Assert
            expect(ids.length).toEqual(0);
        });
        it('returns the id once for each unique coin', () => {
            // Arrange
            service.addPurchase(purchase1);
            service.addPurchase(purchase2);
            service.addPurchase(purchase3);

            // Act
            const ids = service.getAllUniqueIds();

            // Assert
            expect(ids.length).toEqual(2);
            expect(ids.filter(item => item === 1).length).toEqual(1);
            expect(ids.filter(item => item === 12).length).toEqual(1);
        });
    });

    /* describe('getLastAddedDate()', () => {
        it('returns the most recent date from all owned coins', () => {
            // Arrange
            const oldDate = new Date(2011,1,1,11,11,0);
            const purchaseDetails = new PurchaseDetails(250.55, CurrencyEnum.EUR, oldDate);
            const oldCoin = new CryptoPurchase(coinName, purchaseDetails, 5)
        
            service.addPurchase(oldCoin);

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
            const oldCoin = new CryptoPurchase(coinName, purchaseDetails, 5)
            service.addPurchase(oldCoin);
            service.addPurchase(testCoin);

            // Act
            var returnedDate = service.getLastAddedDate();

            // Assert
            expect(returnedDate).toEqual(testCoin.purchaseDetails.date);
            expect(service['lastAddedCoinDate']).toEqual(testCoin.purchaseDetails.date);
        });
    });
 */
});
