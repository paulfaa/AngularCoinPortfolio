import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';
import { IValue } from './types/value.interface';

@Injectable({providedIn: 'root'})
export class CoinServiceComponent {

  private allCoins: Coin[] = [
    new Coin("Bitcoin","BTC"),
    new Coin("Litecoin","LTE")
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

    this.allCoins.forEach(Coin => {
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
