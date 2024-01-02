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
import { of } from 'rxjs';
import { SortModeEnum } from '../types/sortModeEnum';
import { PURCHASES_STORAGE_KEY } from '../shared/constants/constants';

describe('PurchasesService', () => {

    let service: PurchasesService;
    let mockSettingsService: jasmine.SpyObj<SettingsService>;

    mockSettingsService = jasmine.createSpyObj('mockSettingsService', ['getSelectedSortMode']);

    const purchase1 = new CryptoPurchaseBuilder()
        .name(new CryptoName("Bitcoin", "BTC", 1))
        .purchaseDetails(new PurchaseDetails(5, CurrencyEnum.EUR, new Date()))
        .quantity(5)
        .value(new Value(15, CurrencyEnum.EUR, new Date()))
        .build();
    const purchase2 = new CryptoPurchaseBuilder()
        .name(new CryptoName("Bitcoin", "BTC", 1))
        .purchaseDetails(new PurchaseDetails(5, CurrencyEnum.EUR, new Date()))
        .quantity(10)
        .value(new Value(30, CurrencyEnum.EUR, new Date()))
        .build();
    const purchase3 = new CryptoPurchaseBuilder()
        .name(new CryptoName("Cardano", "ADA", 12))
        .purchaseDetails(new PurchaseDetails(10, CurrencyEnum.EUR, new Date()))
        .quantity(1)
        .value(new Value(5, CurrencyEnum.EUR, new Date()))
        .build()

    beforeEach(waitForAsync(() => {
        localStorage.removeItem(PURCHASES_STORAGE_KEY);
        mockSettingsService.getSelectedSortMode.and.returnValue(of(SortModeEnum.DEFAULT));
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: SettingsService, useValue: mockSettingsService }
            ]
        }).compileComponents();
        service = TestBed.inject(PurchasesService);
    }));
    afterEach(() => {
        service.clearAllPurchases();
        service['purchasesSubject'].next([]);
    });

    describe('addPurchase()', () => {
        it('adds the specified purchase to the list', (done) => {
            // Arrange
            const purchases = service['purchasesSubject'].getValue().length;
            expect(purchases).toEqual(0);

            // Act
            service.addPurchase(purchase1);

            // Assert
            service['purchases$'].subscribe(purchases => {
                expect(purchases.length).toEqual(1);
                done();
            });
        });
    });

    describe('clearAllPurchases()', () => {
        it('removes all coins from the list', (done) => {
            // Arrange
            service.addPurchase(purchase1);
            service.addPurchase(purchase2);

            // Act
            service.clearAllPurchases();

            // Assert
            service.getAllPurchases().subscribe(purchases => {
                expect(purchases.length).toEqual(0);
                done();
            });
        });
    });

    describe('removePurchase()', () => {
        it('removes the passed value if it exists in purchases', (done) => {
            // Arrange
            service.addPurchase(purchase1);
            expect(service['purchasesSubject'].getValue().length).toEqual(1);
            const purchases = service['purchasesSubject'].getValue();
            expect(purchases[0]).toEqual(purchase1);

            // Act
            service.removePurchase(purchase1);

            // Assert
            service.getAllPurchases().subscribe(purchases => {
                expect(purchases.length).toEqual(0);
                done();
            });
            //assert that updateStorage() and purchasesSubject.next were called
        });
        it('does nothing if the purchase is not held', () => {
            // Arrange
            service.addPurchase(purchase1);
            expect(service['purchasesSubject'].getValue().length).toEqual(1);
            const purchases = service['purchasesSubject'].getValue();
            expect(purchases[0]).toEqual(purchase1);

            // Act
            service.removePurchase(purchase2);

            // Assert
            expect(service['purchasesSubject'].getValue().length).toEqual(1);
            expect(purchases[0]).toEqual(purchase1);
            //assert that updateStorage() and purchasesSubject.next were not called
        });
    });

    describe('getQuantityHeldById()', () => {
        it('returns 0 if users owns none', () => {
            // Act
            expect(service['purchasesSubject'].getValue().length).toEqual(0);
            const amount = service.getQuantityHeldById(23)

            // Assert
            expect(amount).toEqual(0);
        });
        it('returns total holdings of the passed id', () => {
            // Arrange
            service.addPurchase(purchase1);
            service.addPurchase(purchase2);

            // Act
            const amount = service.getQuantityHeldById(1)

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
