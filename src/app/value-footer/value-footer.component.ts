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
    this.totalValue = this.calculateValueOfTicker();
  }

  private calculateValueOfTicker(): number{
    var totalValue = 0;
    var matchingCoins = this.coinService.getCoinsByTicker(this.ticker)
    matchingCoins.forEach(coin => {
      totalValue = totalValue + coin.purchaseDetails.price; //should use profir variable instead
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  }

}
