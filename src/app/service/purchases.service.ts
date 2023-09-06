import { Injectable } from '@angular/core';
import StorageUtils from '../storage.utils';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { CryptoName } from '../types/cryptoName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { Observable, Subscription, of } from 'rxjs';
import { nameEnum } from '../types/nameEnum';

@Injectable({providedIn: 'root'})
export class PurchasesService{

  private purchases: CryptoPurchase[];
  private uniqueTickers: string[];
  private lastPurchaseDate: Date;
  
  constructor() {
        this.initService();
}

  private initService(): void{
    var storedPurchases = StorageUtils.readFromStorage('savedCoins');
    if (storedPurchases === null){ 
      console.log('init method setting heldcoins and uniquetickers to empty list')
      this.purchases = [];
      this.uniqueTickers = [];
    }
    else {
      console.log('setting this.heldcoins to ' + storedPurchases)
      this.purchases = storedPurchases;
      this.uniqueTickers = StorageUtils.readFromStorage('uniqueTickers');
    }
}

//move this, also make sure add page still works properly
  private cryptoNames: CryptoName[] = [
    new CryptoName("Bitcoin","BTC"),
    new CryptoName("Cardano","ADA"),
    new CryptoName("Litecoin","LTE"),
    new CryptoName("Ethereum","ETH"),
    new CryptoName("Polkadot","DOT"),
    new CryptoName("Stella","XLM"),
    new CryptoName("Tether","USDT"),
    new CryptoName("XRP","XRP"),
    new CryptoName("Solana","SOL")
  ]

  public addPurchase(purchase: CryptoPurchase): void{
    if(this.uniqueTickers.includes(purchase.name.ticker) == false){
      this.uniqueTickers.push(purchase.name.ticker);
    }
    this.purchases.push(purchase);
    this.sortAllPurchases();
    this.updateStorage();
    
  }

  //can probably remove
  public addToHeldCoins(ticker: string, purchaseDetails: PurchaseDetails, quantity: number){
    var coinName = new CryptoName(nameEnum[ticker], ticker) //TEST
    //console.log(this.heldCoins);
    if(this.uniqueTickers.includes(ticker) == false){
      this.uniqueTickers.push(ticker);
    }
    this.purchases.push(new CryptoPurchase(coinName, purchaseDetails, quantity));
    this.sortAllPurchases();
    this.updateStorage();
  }

  private updateStorage(): void{
    StorageUtils.writeToStorage('savedCoins', this.purchases)
    StorageUtils.writeToStorage('uniqueTickers', this.uniqueTickers)
  }

  public removeFromHeldCoins(purchaseToRemove: CryptoPurchase): void{
    this.purchases.forEach((value,index)=>{
      if(value==purchaseToRemove) this.purchases.splice(index,1);
    });
    this.updateStorage();
  }

  public getAmountHeldOfTicker(ticker: string): number{
    var counter = 0;
    if(this.purchases != null && this.purchases.length >= 1){
      this.purchases.forEach(purchase => {
        if(purchase.name.ticker == ticker){
          counter = counter + purchase.quantity
        }
      });
    }
    return counter;
  }

  public getLengthOfHeldCoins(): number{
    if(this.purchases != null){
      return this.purchases.length;
    }
    else{
      return 0;
    }
  }

  public clearAllPurchases(): void{
    console.log("clearing all purchases");
    this.purchases = [];
    this.uniqueTickers = [];
    this.updateStorage();
  }

  public getAllCryptoNames(): CryptoName[] {
    let names = [];
    this.cryptoNames.forEach(name => {
      names.push(name)
    });
    return names;
  }

  public getAllPurchases(): Observable<CryptoPurchase[]>{
    this.sortAllPurchases();
    return of(this.purchases);
  }

  public getPurchasesByTicker(ticker: string): CryptoPurchase[]{
    var matches = [];
    this.purchases.forEach(c => {
      if (c.name.ticker == ticker){
        matches.push(c);
      }
    });
    return matches;
  }

  public getPurchasesById(id: number): CryptoPurchase[]{
    var matches = [];
    this.purchases.forEach(c => {
      if (c.id == id){
        matches.push(c);
      }
    });
    return matches;
  }

  public getAllUniqueTickers(): string[]{
    var tickers:string[] = [];
    if(this.purchases != null && this.purchases.length >= 1){
      //can optimise here
      this.purchases.forEach(coin => {
        if(tickers.includes(coin.name.ticker) == false){
          tickers.push(coin.name.ticker);
        }
      });
    }
    console.log("All unique tickers: " + tickers);
    this.uniqueTickers = tickers;
    return tickers;
  }

  //sorts list alphabetically by ticker then by purchase date
  private sortAllPurchases(): void{
    if(this.purchases != null && this.purchases.length >= 2){
      console.log("this.purchases: " + this.purchases);
      this.purchases.sort((a,b) => a.name.ticker.localeCompare(b.name.displayName) || b.purchaseDetails.date.valueOf() - a.purchaseDetails.date.valueOf()); //was throwing error, seems to work again
    }
  }

  private filterCoins(coins: CryptoPurchase[], text: string): CryptoPurchase[] {
    return coins.filter(coin => {
      return coin.name.displayName.toLowerCase().indexOf(text) !== -1;
    });
  }

  public getLastAddedDate(): Date {
    var date;
    this.purchases.forEach(purchase => {
      var purchaseDate = purchase.purchaseDetails.date;
      if ( date === undefined || date < purchaseDate){
        date = purchaseDate;
      }
    })
    this.lastPurchaseDate = date;
    return date;
  }
}
