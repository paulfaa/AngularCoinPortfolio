import { Component, Injectable, OnInit } from '@angular/core';
import { PurchasesService } from './purchases.service';
import { RateService } from './rate.service';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { Value } from '../types/value.type';
import { CurrencyService } from './currency.service';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class ValueService {

    constructor(
        private coinService: PurchasesService,
        private rateService: RateService,
        private currencyService: CurrencyService
    ) {}

    private totalValue = 0;
    private totalProfit = 0;

    public createNewValue(currentValue: number): Value{
        return new Value(currentValue, this.currencyService.getCurrencySelected(), moment().toDate());
    } 

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
                total = total + (this.coinService.getAmountHeldOfTicker(ticker) * this.rateService.getRateForTicker(ticker));
            });
        }
        this.totalValue = total;
        console.log("Value service total: "+ total);
        return total;
    }

    public calculateTotalExpenditure(): number{
        var expenditure = 0;
        var purchases = this.coinService.getAllPurchases();
        if(purchases != null){
            purchases.forEach(purchase => {
                expenditure = expenditure + purchase.purchaseDetails.price;
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

    public updateValueForSingleCoin(coin: CryptoPurchase): void{
        var updatedValue = coin.quantity * this.rateService.getRateForTicker(coin.name.ticker)
        coin.value.setCurrentValue(updatedValue);
    }

    public updateValueForTicker(ticker: string): void{
        var heldCoins = this.coinService.getAllPurchases();
        if(heldCoins != null){
            heldCoins.forEach(heldCoin => {
                if(heldCoin.name.ticker == ticker){
                    this.updateValueForSingleCoin(heldCoin);
                }
            });
        }
    }
}