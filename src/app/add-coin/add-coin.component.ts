import { Component, OnInit } from '@angular/core';
import { Coin } from '../../app/types/coin.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
})
export class AddCoinComponent implements OnInit {

  allCoins: Coin[];
  coin: Coin;
  
  constructor(public navController: NavController) { }

  ngOnInit() {}

}
