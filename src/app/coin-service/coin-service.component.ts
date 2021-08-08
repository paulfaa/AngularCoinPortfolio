import { Component, OnInit } from '@angular/core';
import { Coin } from '../types';

@Component({
  selector: 'app-coin-service',
  templateUrl: './coin-service.component.html',
  styleUrls: ['./coin-service.component.scss'],
})
export class CoinServiceComponent implements OnInit {

  private allCoins: Coin[] = [
    new Coin("Bitcoin","BTC"),
    new Coin("Litecoin","LTE")
  ]
  
  constructor() { }

  ngOnInit() {}

  

}
