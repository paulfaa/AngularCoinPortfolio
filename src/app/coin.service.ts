import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';

@Injectable({providedIn: 'root'})
export class CoinServiceComponent {

  private allCoins: Coin[] = [
    new Coin("Bitcoin","BTC"),
    new Coin("Litecoin","LTE")
  ]

  private heldCoins: Coin[];

  addCoin(c: Coin){
    this.heldCoins.push(c);
  }
  
  getAllCoinNames(): Coin[] {
    let coins = [];

    this.allCoins.forEach(Coin => {
      coins.push(Coin)
    });
    console.log("Output of getallcoinnames: ", coins);
    return coins;
  }

  filterCoins(coins: Coin[], text: string): Coin[] {
    return coins.filter(coin => {
      return coin.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  
}
