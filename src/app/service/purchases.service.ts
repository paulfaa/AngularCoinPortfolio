import { Injectable } from '@angular/core';
import StorageUtils from '../storage.utils';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PurchasesService {

  private purchasesSubject = new BehaviorSubject<CryptoPurchase[]>(this.initService());
  private purchases$: Observable<CryptoPurchase[]> = this.purchasesSubject.asObservable();
  private uniqueCoinmarketIds$: Observable<number[]> = this.purchasesSubject.pipe(
    map(purchases => {
      const uniqueIds = new Set();
      return purchases.reduce((ids, purchase) => {
        const id = purchase.name.coinMarketId;
        if (!uniqueIds.has(id)) {
          uniqueIds.add(id);
          ids.push(id);
        }
        return ids;
      }, []);
    }));
  private lastPurchaseDate: Date; //check if needed

  constructor() { }

  private initService(): CryptoPurchase[] {
    var storedPurchases = StorageUtils.readFromStorage('savedCoins');
    if (storedPurchases === null || storedPurchases == undefined) {
      console.log('init method returning empty list')
      return [];
    }
    else {
      console.log('init method returning ' + storedPurchases)
      return storedPurchases;
    }
  }

  public addPurchase(purchase: CryptoPurchase) {
    const currentPurchases = this.purchasesSubject.getValue();
    const updatedPurchases = [...currentPurchases, purchase];
    this.purchasesSubject.next(updatedPurchases);
    this.updateStorage();
  }

  public removePurchase(purchase: CryptoPurchase) {
    const currentPurchases = this.purchasesSubject.getValue();
    const updatedPurchases = currentPurchases.filter(p => p !== purchase);  //refactor
    this.purchasesSubject.next(updatedPurchases);
    this.updateStorage();
  }

  public getAllPurchases() {
    return this.purchases$;
  }

  public getUniqueIds(): Observable<number[]> {
    return this.uniqueCoinmarketIds$;
  }

  public getAllUniqueTickers(): string[] {
    return Array.from(this.purchasesSubject.getValue().map(purchase => purchase.name.ticker));
  }

  public getAllUniqueIds(): number[] {
    return Array.from(this.purchasesSubject.getValue().map(purchase => purchase.name.coinMarketId));
  }

  private updateStorage(): void {
    this.sortAllPurchases();
    StorageUtils.writeToStorage('savedCoins', this.purchasesSubject.getValue())
  }

  //refactor to use coinMarket id instead
  public getAmountHeldOfTicker(ticker: string): number {
    var counter = 0;
    var purchases = this.purchasesSubject.getValue();
    if (purchases != null && purchases.length >= 1) {
      purchases.forEach(purchase => {
        if (purchase.name.ticker == ticker) {
          counter = counter + purchase.quantity
        }
      });
    }
    console.log("user holding " + counter + " ticker")
    return counter;
  }

  public getQuantityHeldById(id: number): number {
    var counter = 0;
    var purchases = this.purchasesSubject.getValue().filter(purchase => purchase.name.coinMarketId == id);
    purchases.forEach(purchase => {
      counter = counter + purchase.quantity;
    });
    console.log(`quantity held of id ${id} is ${counter}`)
    return counter;
  }

  public getNumberOfPurchases(): number {
    return this.purchasesSubject.getValue().length;
  }

  public clearAllPurchases(): void {
    console.log("clearing all purchases");
    StorageUtils.clearAllStorage();
    this.purchasesSubject.next([]);
    this.updateStorage();
  }

  //refactor to use coinmarket id
  public getPurchasesByTicker(ticker: string): CryptoPurchase[] {
    var matches = [];
    this.purchasesSubject.getValue().forEach(c => {
      if (c.name.ticker == ticker) {
        matches.push(c);
      }
    });
    return matches;
  }

  public getPurchasesById(coinMarketId: number): Observable<CryptoPurchase[]> {
    return this.purchasesSubject.pipe(
      map(purchases => purchases.filter(purchase => purchase.name.coinMarketId === coinMarketId))
    )
  }

  //sorts list alphabetically by ticker then by purchase date
  private sortAllPurchases(): void {
    const purchases = this.purchasesSubject.getValue();
    if (purchases != null && purchases.length >= 2) {
      console.log("this.purchases: " + purchases);
      purchases.sort((a, b) => a.name.ticker.localeCompare(b.name.displayName) || b.purchaseDetails.date.valueOf() - a.purchaseDetails.date.valueOf());
    }
  }

  /* private filterCoins(coins: CryptoPurchase[], text: string): CryptoPurchase[] {
    return coins.filter(coin => {
      return coin.name.displayName.toLowerCase().indexOf(text) !== -1;
    });
  } */
}
