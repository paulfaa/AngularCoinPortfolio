import { Component, OnInit } from '@angular/core';
import { Coin } from '../../app/types/coin.interface';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
})
export class AddCoinComponent implements OnInit {

  allCoins: Coin[];
  coin: Coin;
  
  constructor() { }

  ngOnInit() {}

}
