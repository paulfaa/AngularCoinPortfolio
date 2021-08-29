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

  private heldCoins: Coin[];

  private addCoin(c: Coin){
    this.heldCoins.push(c);
  }

  public addToHeldCoins(name: string, ticker: string, value: number){
    this.heldCoins.push(new Coin(name, ticker, value));
  }
  
  getAllCoinNames(): Coin[] {
    let coins = [];

    this.coinNames.forEach(Coin => {
      coins.push(Coin)
    });
    console.log("Output of getallcoinnames: ", coins);
    return coins;
  }

  getAllHeldCoins(){
    return this.heldCoins;
  }

  filterCoins(coins: Coin[], text: string): Coin[] {
    return coins.filter(coin => {
      return coin.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  
}
