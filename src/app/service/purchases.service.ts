import { Injectable } from '@angular/core';
import { nameEnum } from '../nameEnum';
import StorageUtils from '../storage.utils';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { CryptoName } from '../types/cryptoName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';

@Injectable({providedIn: 'root'})
export class PurchasesService{

  private purchases: CryptoPurchase[];
  private uniqueTickers: string[];
  private lastAddedCoinDate: Date;

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
  private coinNames: CryptoName[] = [
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

  public updateStorage(): void{
    StorageUtils.writeToStorage('savedCoins', this.purchases)
    StorageUtils.writeToStorage('uniqueTickers', this.uniqueTickers)
  }

  public removeFromHeldCoins(coinToDelete: CryptoPurchase): void{
    this.purchases.forEach((value,index)=>{
      if(value==coinToDelete) this.purchases.splice(index,1);
    });
    this.updateStorage();
  }

  public getAmountHeldOfTicker(ticker: string): number{
    var counter = 0;
    if(this.purchases != null && this.purchases.length >= 1){
      this.purchases.forEach(coin => {
        if(coin.name.ticker == ticker){
          counter = counter + coin.quantity
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
    console.log("clearing all coins");
    this.purchases = [];
    this.uniqueTickers = [];
    this.updateStorage();
  }

  public getAllCoinNames(): CryptoName[] {
    let names = [];
    this.coinNames.forEach(Coin => {
      names.push(Coin)
    });
    return names;
  }

  public getAllPurchases(): CryptoPurchase[]{
    //should only have to load this once on app start, rewrite this
    this.sortAllPurchases();
    return this.purchases;
  }

  public getCoinsByTicker(ticker: string): CryptoPurchase[]{
    var matches = [];
    this.purchases.forEach(c => {
      if (c.name.ticker == ticker){
        matches.push(c);
      }
    });
    return matches;
  }

  public getCoinsById(id: number): CryptoPurchase[]{
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
      console.log("this.heldcoins: " + this.purchases);
      this.purchases.sort((a,b) => a.name.ticker.localeCompare(b.name.displayName) || b.purchaseDetails.date.valueOf() - a.purchaseDetails.date.valueOf()); //was throwing error, seems to work again
    }
  }

  private filterCoins(coins: CryptoPurchase[], text: string): CryptoPurchase[] {
    return coins.filter(coin => {
      return coin.name.displayName.toLowerCase().indexOf(text) !== -1;
    });
  }

  public getLastAddedDate(): Date{
    var date;
    this.purchases.forEach(coin => {
      var purchaseDate = coin.purchaseDetails.date;
      if ( date===undefined || date < purchaseDate){
        date = purchaseDate;
      }
    })
    this.lastAddedCoinDate = date;
    return date;
  }
}
