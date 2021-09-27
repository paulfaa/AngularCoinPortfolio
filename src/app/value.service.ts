import { Component, Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CoinServiceComponent } from './coin.service';
import { CurrencyServiceComponent } from './currency.service';
import StorageUtils from './storage.utils';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { Rate } from './types/rate.type';
import { IValue } from './types/value.interface';

//shoul probably be injected somewhere else
@Injectable({providedIn: 'root'})
export class ValueServiceComponent {

    private rates: Rate[];
    private ratesLastUpdated: Date;
    coinService: CoinServiceComponent;
    currencyService: CurrencyServiceComponent;

    public calculateTotalProfit(): number{
        var totalValue;
        this.coinService.getAllUniqueTickers().forEach(ticker => {
            totalValue = this.coinService.getAmountHeld(ticker) * this.getRateForTicker(ticker);
        });
        //should return totalvalue - purchase price
        return totalValue;
    }

    public getRateForTicker(ticker: string){
        return this.rates.find(i => i.ticker === ticker).value;
    }

    public updateAllExchangeRates(){
        var now = moment();
        var userCurrency = this.currencyService.getCurrencySelected();
        //if rates are more than 1 hour old update, otherwise nothing
        if(moment().subtract(1, 'hour') < now){
            this.coinService.getAllUniqueTickers().forEach(ticker => {
                var rate = this.getRateForTicker(ticker);
                this.rates.push(new Rate(ticker, rate, userCurrency, new Date))
            });
        }
        this.ratesLastUpdated = now.toDate();
        StorageUtils.writeToStorage("rates", this.rates);
    }
}