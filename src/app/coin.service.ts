import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';

@Injectable()
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

    return coins;
  }

  

}
