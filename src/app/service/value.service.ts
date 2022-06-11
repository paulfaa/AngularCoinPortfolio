import { Component, Injectable, OnInit } from '@angular/core';
import { CoinService } from './coin.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RateService } from './rate.service';

@Injectable({providedIn: 'root'})
export class ValueService {

    constructor(
        private coinService: CoinService,
        private rateService: RateService,
    ) {}

    private totalValue = 0;
    private totalProfit = 0;

    public calculateTotalProfit(): number{
        var totalExpendature = this.getTotalExpenditure();
        var totalValue = this.calculateTotalValue();
        var totalProfit = totalValue - totalExpendature;
        this.totalProfit = totalProfit;
        return totalProfit;
    }

    public calculateTotalValue(): number{
        var total = 0;
        this.rateService.updateAllExchangeRates();
        var allTickers = this.coinService.getAllUniqueTickers();
        if(allTickers != null && allTickers.length >= 1){
            allTickers.forEach(ticker => {
                total = total + this.coinService.getAmountHeldOfTicker(ticker) * this.rateService.getRateForTicker(ticker);
            });
        }
        this.totalValue = total;
        return total;
    }

    public getTotalExpenditure(): number{
        var expenditure = 0;
        var heldCoins = this.coinService.getAllHeldCoins();
        if(heldCoins != null){
            heldCoins.forEach(heldCoin => {
                expenditure = expenditure + heldCoin.purchasePrice;
            });
        }
        return expenditure;
      }

    public calculateValueForTicker(ticker: string): number{
        //this.updateAllExchangeRates();
        console.log("value: " + this.rateService.getRateForTicker(ticker) * this.coinService.getAmountHeldOfTicker(ticker));
        //var rate = this.rateService.getRateForTicker(ticker); //always returning 0
        return this.rateService.getRateForTicker(ticker) * this.coinService.getAmountHeldOfTicker(ticker);
    }
}