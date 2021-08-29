import { Component, OnInit } from '@angular/core';
import { Coin } from '@types';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CoinServiceComponent } from '../coin.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.page.html',
  styleUrls: ['./add-form.page.scss'],
})
export class AddFormPage implements OnInit {
  coins: Coin[];
  coin: Coin;

  constructor(
    private coinService: CoinServiceComponent
  ) { }

  ngOnInit() {
    this.coins = this.coinService.getAllCoinNames();
  }

  coinChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('coin:', event.value);
  }

}
