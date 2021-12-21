import { Component, Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CoinServiceComponent } from './coin.service';
import { CurrencyServiceComponent } from './currency.service';
import StorageUtils from './storage.utils';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { Rate } from './types/rate.type';
import { IValue } from './types/value.interface';

import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface RatesResponse {
    coinId: number;
    coinValue: number;
    currency: string;
    date: Date
}

//shoul probably be injected somewhere else
@Injectable({providedIn: 'root'})
export class ValueServiceComponent {

    constructor(
        private coinService: CoinServiceComponent,
        private currencyService: CurrencyServiceComponent,
        private http: HttpClient
        ) { }

    private rates: Rate[];
    private ratesLastUpdated: Date;
    private requestUrl = 'http://localhost:8009/';
    //coinService: CoinServiceComponent;
    //currencyService: CurrencyServiceComponent;

    getConfigResponse(currency: string, coinId: number): Observable<HttpResponse<RatesResponse>> {
        return this.http.get<RatesResponse>(
            this.requestUrl + "?currency=" + currency + "?id=" + coinId, { observe: 'response' });
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      }

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