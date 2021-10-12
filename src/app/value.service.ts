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
        private currencyService: CurrencyServiceComponent,
        ) { }

    private rates: Rate[];
    private ratesLastUpdated: Date;
    //coinService: CoinServiceComponent;
    //currencyService: CurrencyServiceComponent;

    public calculateTotalProfit(): number{
        var totalProfit = this.calculateTotalValue();
        var purchasePrice = 4;
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

    public calculateValueForTicker(ticker: string): number{
        this.rates = StorageUtils.readFromStorage('rates');
        //console.log("rates: ", this.rates);
        this.updateAllExchangeRates();
        return this.getRateForTicker(ticker) * this.coinService.getAmountHeld(ticker);
    }

    public getRateForTicker(ticker: string){
        //search works fine but cant access value property
        var c = this.rates.find(i => i.ticker === ticker);
        console.log("c: ", c);
        return this.rates.find(i => i.ticker === ticker).getValue();
    }

    private nullCheckRatesList(){
        if (this.rates == null){
            this.rates = [];;
        }
    }

    //need to rewrite this to replace outdated rates and leave inactive ones
    public updateAllExchangeRates(){
        var now = moment();
        this.rates = [];
        var userCurrency = this.currencyService.getCurrencySelected();
        //if rates are more than 1 hour old update, otherwise nothing
        if(moment().subtract(1, 'hour') < now){
            //console.log(this.coinService.getAllUniqueTickers());
            this.coinService.getAllUniqueTickers().forEach(ticker => {
                //var rate = backend.getRate(ticker, userCurrency);
                var rate = 5; //just for testing
                if (rate == null || rate == 0){
                    return;
                }
                this.nullCheckRatesList();
                this.rates.push(new Rate(ticker, rate, userCurrency, new Date))
            });
        }
        this.ratesLastUpdated = now.toDate();
        StorageUtils.writeToStorage("rates", this.rates);
    }
}