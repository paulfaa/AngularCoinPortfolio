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

    constructor(private coinService: CoinServiceComponent,
        private currencyService: CurrencyServiceComponent
        ) { }

    private rates: Rate[];
    private ratesLastUpdated: Date;
    //coinService: CoinServiceComponent;
    //currencyService: CurrencyServiceComponent;

    public calculateTotalProfit(): number{
        var totalProfit = this.calculateTotalValue();
        var purchasePrice = Math.random() * (30 - 1) + 1;
        return totalProfit - purchasePrice;
    }

    public calculateTotalValue(): number{
        this.rates = StorageUtils.readFromStorage('rates');
        var totalValue;
        this.updateAllExchangeRates();
        this.coinService.getAllUniqueTickers().forEach(ticker => {
            totalValue = this.coinService.getAmountHeld(ticker) * this.getRateForTicker(ticker);
        });
        return totalValue;
    }

    public getRateForTicker(ticker: string){
        return this.rates.find(i => i.ticker === ticker).value;
    }

    private nullCheckRatesList(){
        if (this.rates == null){
            this.rates = [];;
        }
    }

    public updateAllExchangeRates(){
        var now = moment();
        var userCurrency = this.currencyService.getCurrencySelected();
        //if rates are more than 1 hour old update, otherwise nothing
        if(moment().subtract(1, 'hour') < now){
            //console.log(this.coinService.getAllUniqueTickers());
            this.coinService.getAllUniqueTickers().forEach(ticker => {
                //var rate = backend.getRate(ticker, userCurrency);
                var rate = Math.random() * (30 - 1) + 1; //just for testing
                this.nullCheckRatesList();
                this.rates.push(new Rate(ticker, rate, userCurrency, new Date))
            });
        }
        this.ratesLastUpdated = now.toDate();
        StorageUtils.writeToStorage("rates", this.rates);
    }
}