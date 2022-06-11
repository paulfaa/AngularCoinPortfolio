import { Component, Injectable, OnInit } from '@angular/core';
import { CoinService } from './coin.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RateService } from './rate.service';
import { Coin } from '../types/coin.type';

@Injectable({providedIn: 'root'})
export class ValueService {

    constructor(
        private coinService: CoinService,
        private rateService: RateService,
    ) {}

    private totalValue = 0;
    private totalProfit = 0;

    public calculateTotalProfit(): number{
        var totalExpendature = this.calculateTotalExpenditure();
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

    public calculateTotalExpenditure(): number{
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

    public updateValueForSingleCoin(coin: Coin): void{
        var updatedValue = coin.quantity * this.rateService.getRateForTicker(coin.ticker)
        coin.currentValue.setCurrentValue(updatedValue);
    }

    public updateValueForTicker(ticker: string): void{
        var heldCoins = this.coinService.getAllHeldCoins();
        if(heldCoins != null){
            heldCoins.forEach(heldCoin => {
                if(heldCoin.ticker == ticker){
                    this.updateValueForSingleCoin(heldCoin);
                }
            });
        }
    }
}