import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { IValue } from './types/value.interface';

@Injectable({providedIn: 'root'})
export class CoinServiceComponent {

  private coinNames: Coin[] = [
    new Coin("Bitcoin","BTC"),
    new Coin("Cardano","ADA"),
    new Coin("Litecoin","LTE")
  ]

  private coinNamesTest: CoinName[] = [
    new CoinName("Bitcoin","BTC"),
    new CoinName("Cardano","ADA"),
    new CoinName("Litecoin","LTE"),
    new CoinName("Tron","TRX")
  ]

  private heldCoins: Coin[] = [];

  private addCoin(c: Coin){
    this.heldCoins.push(c);
  }

  //change this constructor to only require ticker and set name automatically based on lookup
  public addToHeldCoins(name: string, ticker: string, purchasePrice: number, quantity: number){
    this.heldCoins.push(new Coin(name, ticker, purchasePrice, quantity));
  }
  
  public getAllCoinNames(): CoinName[] {
    let names = [];

    this.coinNames.forEach(Coin => {
      names.push(Coin)
    });
    console.log("Output of getallcoinnames: ", names);
    return names;
  }

  public getAllHeldCoins(){
    this.getPriceOfHoldings();
    return this.heldCoins;
  }

  filterCoins(coins: Coin[], text: string): Coin[] {
    return coins.filter(coin => {
      return coin.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  public getPriceOfHoldings(): number{
    var counter = 0;
    this.heldCoins.forEach(heldCoin => {
      counter = counter + heldCoin.purchasePrice;
    });
    console.log("Counter: ", counter);
    return counter;
  }

  public getLastUpdatedDate(): string{
    var minDate = new Date;
    this.heldCoins.forEach(heldCoin => {
      if (heldCoin.purchaseDate < minDate){
        minDate = heldCoin.purchaseDate;
      }
    });
    return minDate.toLocaleString();
  }
}
