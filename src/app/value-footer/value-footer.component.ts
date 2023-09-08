import { Component, Input, OnInit } from '@angular/core';
import { PurchasesService } from '../service/purchases.service';

@Component({
  selector: 'value-footer',
  templateUrl: './value-footer.component.html',
  styleUrls: ['./value-footer.component.scss'],
})
export class ValueFooterComponent implements OnInit {
  @Input() ticker = '';
  @Input() id = 0;

  totalValue: number;
  totalProfit: number;

  //needs refactor
  constructor(
    private purchasesService: PurchasesService
  ) { }

  ngOnInit() {
    // should not call only on ngInit, also need to recalculate if coins of the same ticker are deleted. need to add deleteListener
    this.totalValue = this.calculateValueOfTicker();
  }

  public calculateValueOfTicker(): number{
    var totalValue = 0;
    const purchasesMatchingTicker = this.purchasesService.getPurchasesByTicker(this.ticker);
    purchasesMatchingTicker.forEach(purchase => {
      totalValue = totalValue + purchase.purchaseDetails.price;
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  }

  public calculateProfitOfTicker(): number{
    var totalProfit = 0;
    const purchasesMatchingTicker = this.purchasesService.getPurchasesByTicker(this.ticker);
    purchasesMatchingTicker.forEach(coin => {
      totalProfit = totalProfit + coin.profit;
    });
    console.log("total profit for " + this.ticker + ": " + totalProfit);
    return totalProfit;
  }

  public calculateValueOfId(): number{
    var totalValue = 0;
    var purchasesMatchingId = this.purchasesService.getPurchasesById(this.id);
    purchasesMatchingId.forEach(purchase => {
      totalValue = totalValue + purchase.purchaseDetails.price; 
    });
    console.log("totalValueFor " + this.ticker + ": " + totalValue);
    return totalValue;
  }

  public calculateProfitOfId(): number{
    var totalProfit = 0;
    var purchasesMatchingId = this.purchasesService.getPurchasesById(this.id);
    purchasesMatchingId.forEach(purchases => {
      totalProfit = totalProfit + purchases.profit; 
    });
    console.log("totalValueFor " + this.ticker + ": " + totalProfit);
    return totalProfit;
  }
}
