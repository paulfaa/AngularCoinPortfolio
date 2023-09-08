import { Injectable } from '@angular/core';
import StorageUtils from '../storage.utils';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { CryptoName } from '../types/cryptoName.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { cryptoNames } from '../shared/constants/constants';

@Injectable({providedIn: 'root'})
export class PurchasesService{

  private purchasesSubject = new BehaviorSubject<CryptoPurchase[]>(this.initService());
  private purchases$: Observable<CryptoPurchase[]> = this.purchasesSubject.asObservable();
  private lastPurchaseDate: Date; //check if needed
  
  constructor(){}

  private initService(): CryptoPurchase[]{
    var storedPurchases = StorageUtils.readFromStorage('savedCoins');
    if (storedPurchases === null || storedPurchases == undefined){ 
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
    this.updateStorage();
    this.purchasesSubject.next(updatedPurchases);
  }

  public removePurchase(purchase: CryptoPurchase) {
    const currentPurchases = this.purchasesSubject.getValue();
    const updatedPurchases = currentPurchases.filter(p => p == purchase);
    this.updateStorage();
    this.purchasesSubject.next(updatedPurchases);
  }

  public getAllPurchases() {
    return this.purchases$;
  }

  public getAllUniqueTickers(): Set<string>{
    return new Set(this.purchasesSubject.getValue().map(purchase => purchase.name.ticker));
  }

  public getAllUniqueIds(): Set<number>{
    return new Set(this.purchasesSubject.getValue().map(purchase => purchase.name.coinMarketId));
  }

  private updateStorage(): void {
    this.sortAllPurchases();
    StorageUtils.writeToStorage('savedCoins', this.purchasesSubject.getValue())
  }

  /* public removeFromHeldCoins(purchaseToRemove: CryptoPurchase): void{
    const currentPurchases = this.purchasesSubject.getValue();
    currentPurchases.forEach((value,index)=>{
      if(value == purchaseToRemove){
        this.purchasesSubject.next(currentPurchases.splice(index,1));
        this.updateStorage();
      } 
    });
  } */

  //refactor to use coinMarket id instead
  public getAmountHeldOfTicker(ticker: string): number{
    var counter = 0;
    var purchases = this.purchasesSubject.getValue();
    if(purchases != null && purchases.length >= 1){
      purchases.forEach(purchase => {
        if(purchase.name.ticker == ticker){
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
    console.log("user holding " + counter + " id")
    return counter;
  }

  public getNumberOfPurchases(): number{
    return this.purchasesSubject.getValue().length;
  }

  public clearAllPurchases(): void{
    console.log("clearing all purchases");
    this.purchasesSubject.next([]);
    this.updateStorage();
  }

  //refactor to use stored const
  /* public getAllCryptoNames(): CryptoName[] {
    let names = [];
    cryptoNames.forEach(name => {
      names.push(name)
    });
    return names;
  } */

  //refactor to use coinmarket id
  public getPurchasesByTicker(ticker: string): CryptoPurchase[]{
    var matches = [];
    this.purchasesSubject.getValue().forEach(c => {
      if (c.name.ticker == ticker){
        matches.push(c);
      }
    });
    return matches;
  }

  public getPurchasesById(coinMarketId: number): CryptoPurchase[]{
    return this.purchasesSubject.getValue().filter(purchase => purchase.name.coinMarketId === coinMarketId);
  }

  //sorts list alphabetically by ticker then by purchase date
  private sortAllPurchases(): void{
    const purchases = this.purchasesSubject.getValue();
    if(purchases != null && purchases.length >= 2){
      console.log("this.purchases: " + purchases);
      purchases.sort((a,b) => a.name.ticker.localeCompare(b.name.displayName) || b.purchaseDetails.date.valueOf() - a.purchaseDetails.date.valueOf());
    }
  }

  /* private filterCoins(coins: CryptoPurchase[], text: string): CryptoPurchase[] {
    return coins.filter(coin => {
      return coin.name.displayName.toLowerCase().indexOf(text) !== -1;
    });
  } */

  /* public getLastAddedDate(): Date {
    var date;
    this.purchasesSubject.getValue().forEach(purchase => {
      var purchaseDate = purchase.purchaseDetails.date;
      if ( date === undefined || date < purchaseDate){
        date = purchaseDate;
      }
    })
    this.lastPurchaseDate = date;
    return date;
  } */
}
