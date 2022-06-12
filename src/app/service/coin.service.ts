import { Injectable } from '@angular/core';
import { nameEnum } from '../nameEnum';
import StorageUtils from '../storage.utils';
import { Coin } from '../types/coin.type';
import { CoinName } from '../types/coinName.type';
import { PurchaseDetails } from '../types/purchaseDetails.type';

@Injectable({providedIn: 'root'})
export class CoinService{

  private heldCoins: Coin[];
  private uniqueTickers: string[];
  private lastAddedCoinDate: Date;

  constructor() {
    this.initService();
}

  private initService(): void{
    var storedCoins = StorageUtils.readFromStorage('savedCoins');
    if (storedCoins === null){ 
      console.log('init method setting heldcoins and uniquetickers to empty list')
      this.heldCoins = [];
      this.uniqueTickers = [];
    }
    else {
      console.log('setting this.heldcoins to ' + storedCoins)
      this.heldCoins = storedCoins;
      this.uniqueTickers = StorageUtils.readFromStorage('uniqueTickers');
    }
}

//move this, also make sure add page still works properly
  private coinNames: CoinName[] = [
    new CoinName("Bitcoin","BTC"),
    new CoinName("Cardano","ADA"),
    new CoinName("Litecoin","LTE"),
    new CoinName("Ethereum","ETH"),
    new CoinName("Polkadot","DOT"),
    new CoinName("Stella","XLM"),
    new CoinName("Tether","USDT"),
    new CoinName("XRP","XRP"),
    new CoinName("Solana","SOL")
  ]

  public addCoin(c: Coin): void{
    if(this.uniqueTickers.includes(c.name.ticker) == false){
      this.uniqueTickers.push(c.name.ticker);
    }
    this.heldCoins.push(c);
    this.sortAllHeldCoins();
    this.updateStorage();
    
  }

  //can probably remove
  public addToHeldCoins(ticker: string, purchaseDetails: PurchaseDetails, quantity: number){
    var coinName = new CoinName(nameEnum[ticker], ticker) //TEST
    //console.log(this.heldCoins);
    if(this.uniqueTickers.includes(ticker) == false){
      this.uniqueTickers.push(ticker);
    }
    this.heldCoins.push(new Coin(coinName, purchaseDetails, quantity));
    this.sortAllHeldCoins();
    this.updateStorage();
  }

  public updateStorage(): void{
    StorageUtils.writeToStorage('savedCoins', this.heldCoins)
    StorageUtils.writeToStorage('uniqueTickers', this.uniqueTickers)
  }

  public removeFromHeldCoins(coinToDelete: Coin): void{
    this.heldCoins.forEach((value,index)=>{
      if(value==coinToDelete) this.heldCoins.splice(index,1);
    });
    this.updateStorage();
  }

  public getAmountHeldOfTicker(ticker: string): number{
    var counter = 0;
    if(this.heldCoins != null && this.heldCoins.length >= 1){
      this.heldCoins.forEach(coin => {
        if(coin.name.ticker == ticker){
          counter = counter + coin.quantity
        }
      });
    }
    return counter;
  }

  public getLengthOfHeldCoins(): number{
    if(this.heldCoins != null){
      return this.heldCoins.length;
    }
    else{
      return 0;
    }
  }

  public clearAllHeldCoins(): void{
    console.log("clearing all coins");
    this.heldCoins = [];
    this.uniqueTickers = [];
    this.updateStorage();
  }

  public getAllCoinNames(): CoinName[] {
    let names = [];
    this.coinNames.forEach(Coin => {
      names.push(Coin)
    });
    return names;
  }

  public getAllHeldCoins(): Coin[]{
    //should only have to load this once on app start, rewrite this
    this.sortAllHeldCoins();
    return this.heldCoins;
  }

  public getAllUniqueTickers(): string[]{
    var tickers:string[] = [];
    if(this.heldCoins != null && this.heldCoins.length >= 1){
      //can optimise here
      this.heldCoins.forEach(coin => {
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
  private sortAllHeldCoins(): void{
    if(this.heldCoins != null && this.heldCoins.length >= 2){
      console.log("this.heldcoins: " + this.heldCoins);
      this.heldCoins.sort((a,b) => a.name.ticker.localeCompare(b.name.ticker) || b.purchaseDetails.date.valueOf() - a.purchaseDetails.date.valueOf()); //was throwing error, seems to work again
    }
  }

  private filterCoins(coins: Coin[], text: string): Coin[] {
    return coins.filter(coin => {
      return coin.name.displayName.toLowerCase().indexOf(text) !== -1;
    });
  }

  public getLastAddedDate(): Date{
    var date;
    this.heldCoins.forEach(coin => {
      var purchaseDate = coin.purchaseDetails.date;
      if ( date===undefined || date < purchaseDate){
        date = purchaseDate;
      }
    })
    this.lastAddedCoinDate = date;
    return date;
  }
}
