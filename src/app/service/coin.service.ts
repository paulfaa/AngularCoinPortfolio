import { Injectable } from '@angular/core';
import { nameEnum } from '../nameEnum';
import StorageUtils from '../storage.utils';
import { Coin } from '../types/coin.interface';
import { CoinName } from '../types/coinName.type';

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

//move this
  private coinNames: Coin[] = [
    new Coin("Bitcoin","BTC"),
    new Coin("Cardano","ADA"),
    new Coin("Litecoin","LTE"),
    new Coin("Ethereum","ETH"),
    new Coin("Polkadot","DOT"),
    new Coin("Stella","XLM"),
    new Coin("Tether","USDT"),
    new Coin("XRP","XRP"),
    new Coin("Solana","SOL")
  ]

  private coinNamesTest: CoinName[] = [
    new CoinName("Bitcoin","BTC"),
    new CoinName("Cardano","ADA"),
    new CoinName("Litecoin","LTE"),
    new CoinName("Tron","TRX")
  ]
  
  public addCoin(c: Coin){
    this.heldCoins.push(c);
  }

  public addToHeldCoins(ticker: string, purchasePrice: number, quantity: number){
    var fullName = nameEnum[ticker];
    //console.log(this.heldCoins);
    if(this.uniqueTickers.includes(ticker) == false){
      this.uniqueTickers.push(ticker);
    }
    this.heldCoins.push(new Coin(fullName, ticker, purchasePrice, quantity));
    this.sortAllHeldCoins();
    this.updateStorage();
  }

  public updateStorage(){
    StorageUtils.writeToStorage('savedCoins', this.heldCoins)
    StorageUtils.writeToStorage('uniqueTickers', this.uniqueTickers)
  }

  public removeFromHeldCoins(coinToDelete: Coin) {
    this.heldCoins.forEach((value,index)=>{
      if(value==coinToDelete) this.heldCoins.splice(index,1);
    });
    this.updateStorage();
  }

  public getAmountHeldOfTicker(ticker: string): number{
    var counter = 0;
    if(this.heldCoins != null && this.heldCoins.length >= 1){
      this.heldCoins.forEach(coin => {
        if(coin.ticker == ticker){
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

  public clearAllHeldCoins(){
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

  public getAllHeldCoins(){
    //should only have to load this once on app start, rewrite this
    this.sortAllHeldCoins();
    return this.heldCoins;
  }

  public getAllUniqueTickers(): string[]{
    var tickers:string[] = [];
    if(this.heldCoins != null && this.heldCoins.length >= 1){
      //can optimise here
      this.heldCoins.forEach(coin => {
        if(tickers.includes(coin.ticker) == false){
          tickers.push(coin.ticker);
        }
      });
    }
    console.log("All unique tickers: " + tickers);
    this.uniqueTickers = tickers;
    return tickers;
  }

  //sorts list alphabetically by ticker then by purchase date
  private sortAllHeldCoins(){
    if(this.heldCoins != null && this.heldCoins.length >= 2){
      this.heldCoins.sort((a,b) => a.ticker.localeCompare(b.ticker) || b.purchaseDate.valueOf() - a.purchaseDate.valueOf());
    }
  }

  private filterCoins(coins: Coin[], text: string): Coin[] {
    return coins.filter(coin => {
      return coin.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  public getLastAddedDate(): Date{
    var date;
    this.heldCoins.forEach(coin => {
      var purchaseDate = coin.purchaseDate;
      if ( date===undefined || date < purchaseDate){
        date = purchaseDate;
      }
    })
    this.lastAddedCoinDate = date;
    return date;
  }
}
