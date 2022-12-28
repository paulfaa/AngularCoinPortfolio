import { Component, Input, OnInit } from '@angular/core';
import { CoinService } from '../service/coin.service';

@Component({
  selector: 'value-footer',
  templateUrl: './value-footer.component.html',
  styleUrls: ['./value-footer.component.scss'],
})
export class ValueFooterComponent implements OnInit {
  @Input() ticker = '';
  @Input() coinId = 0;

  totalValue: number;
  totalProfit: number;

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
      totalValue = totalValue + coin.purchaseDetails.price;
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  }

  public calculateProfitOfTicker(): number{
    var totalProfit = 0;
    const matchingCoins = this.coinService.getCoinsByTicker(this.ticker);
    matchingCoins.forEach(coin => {
      totalProfit = totalProfit + coin.profit;
    });
    console.log("total profit for " + this.ticker + ": " + totalProfit);
    return totalProfit;
  }

  public calculateValueOfId(): number{
    var totalValue = 0;
    var matchingCoins = this.coinService.getCoinsById(this.coinId);
    matchingCoins.forEach(coin => {
      totalValue = totalValue + coin.purchaseDetails.price; 
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  }

  public calculateProfitOfId(): number{
    var totalProfit = 0;
    var matchingCoins = this.coinService.getCoinsById(this.coinId);
    matchingCoins.forEach(coin => {
      totalProfit = totalProfit + coin.profit; 
    });
    console.log("totalValueFor " + this.ticker + ": " + totalProfit);
    return totalProfit;
  }
}
