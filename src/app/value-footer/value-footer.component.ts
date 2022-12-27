import { Component, Input, OnInit } from '@angular/core';
import { CoinService } from '../service/coin.service';

@Component({
  selector: 'value-footer',
  templateUrl: './value-footer.component.html',
  styleUrls: ['./value-footer.component.scss'],
})
export class ValueFooterComponent implements OnInit {
  @Input() ticker = '';

  totalValue: number;

  constructor(
    private coinService: CoinService
  ) { }

  ngOnInit() {
    // should not call only on ngInit, also need to recalculate if coins of the same ticker are deleted. need to add deleteListener
    this.totalValue = this.calculateValueOfTicker();
  }

  public calculateValueOfTicker(): number{
    var totalValue = 0;
    const matchingCoins = this.coinService.getCoinsByTicker(this.ticker);
    matchingCoins.forEach(coin => {
      totalValue = totalValue + coin.profit;
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  }

  /* public calculateValueOfId(): number{
    var totalValue = 0;
    var matchingCoins = this.coinService.getCoinsById(idConverter(this.ticker));
    matchingCoins.forEach(coin => {
      totalValue = totalValue + coin.purchaseDetails.price; 
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  } */
}
