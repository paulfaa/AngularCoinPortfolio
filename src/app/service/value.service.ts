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

    public totalValue = 0;
    public totalProfit = 0;

    public calculateTotalProfit(): number{
        var totalExpendature = 0;
        var totalValue = 0; //shound be var totalValue = this.calculateTotalValue();
        var allCoins = this.coinService.getAllHeldCoins();
        allCoins?.forEach(c => {
            totalExpendature = totalExpendature + c.purchasePrice;
            totalValue = totalValue + c.currentValue;
        });
        var total = totalValue - totalExpendature;
        this.totalProfit = total;
        return total;
    }

    public calculateTotalValue(): number{
        var total = 0;
        this.rateService.updateAllExchangeRates();
        var allTickers = this.coinService.getAllUniqueTickers();
        if(allTickers != null){
            allTickers.forEach(ticker => {
                total = total + this.coinService.getAmountHeldOfTicker(ticker) * this.rateService.getRateForTicker(ticker);
        });
        this.totalValue = total;
        return total;
        }
    }

    public getTotalExpenditure(): number{
        var counter = 0;
        this.coinService.getAllHeldCoins().forEach(heldCoin => {
          counter = counter + heldCoin.purchasePrice;
        });
        return counter;
      }

    public calculateValueForTicker(ticker: string): number{
        //this.updateAllExchangeRates();
        console.log("value: " + this.rateService.getRateForTicker(ticker) * this.coinService.getAmountHeldOfTicker(ticker));
        //var rate = this.rateService.getRateForTicker(ticker); //always returning 0
        return this.rateService.getRateForTicker(ticker) * this.coinService.getAmountHeldOfTicker(ticker);
    }
}