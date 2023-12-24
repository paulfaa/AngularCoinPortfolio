import { Injectable, OnDestroy } from '@angular/core';
import StorageUtils from '../storage.utils';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SortModeEnum } from '../types/sortModeEnum';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class PurchasesService implements OnDestroy {

  private purchasesSubject = new BehaviorSubject<CryptoPurchase[]>(this.initService());
  private purchases$: Observable<CryptoPurchase[]> = this.purchasesSubject.asObservable();
  private sortModeSubscription: Subscription;
  private sortMode: SortModeEnum;
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

  constructor(private settingService: SettingsService) {
    this.sortModeSubscription = this.settingService.getSelectedSortMode().subscribe(sortMode => {
      this.sortMode = sortMode;
      this.updateStorage();
    });
  }

  public ngOnDestroy(): void {
    if (this.sortModeSubscription) {
        this.sortModeSubscription.unsubscribe();
    }
  }

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

  public updateStorage(): void {
    this.sortAllPurchases();
    StorageUtils.writeToStorage('savedCoins', this.purchasesSubject.getValue());
  }

  public getQuantityHeldById(id: number): number {
    var counter = 0;
    var purchases = this.purchasesSubject.getValue().filter(purchase => purchase.name.coinMarketId == id);
    purchases.forEach(purchase => {
      counter = counter + purchase.quantity;
    });
    //console.log(`quantity held of id ${id} is ${counter}`)
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

  public getPurchasesById(coinMarketId: number): Observable<CryptoPurchase[]> {
    return this.purchasesSubject.pipe(
      map(purchases => purchases.filter(purchase => purchase.name.coinMarketId === coinMarketId))
    )
  }

  private sortAllPurchases(): void {
    var updated = false;
    console.log("selected sort mode: ", this.sortMode)
    var purchases = this.purchasesSubject.getValue();
    if (purchases != null && purchases.length >= 2) {
      switch(this.sortMode){
        case SortModeEnum.DEFAULT:
          console.log("Sort default: ", purchases);
          break;
        case SortModeEnum.ALPHABETICAL:
          //sorts list alphabetically by ticker then by purchase date
          console.log("Sort alphabetically: ", purchases);
          purchases.sort((a, b) => a.name.ticker.localeCompare(b.name.displayName) || b.purchaseDetails.date.valueOf() - a.purchaseDetails.date.valueOf());
          break;
        default:
          console.log("No sort mode set");
          break;
      }
    }
    this.purchasesSubject.next(purchases);
  }
}
