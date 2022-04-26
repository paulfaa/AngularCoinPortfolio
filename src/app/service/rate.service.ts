import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, throwError } from "rxjs";
import StorageUtils from "../storage.utils";
import { Rate } from "../types/rate.type";
import { CoinServiceComponent } from "./coin.service";
import { CurrencyServiceComponent } from "./currency.service";
import { LoggingService } from "./logging.service";

export interface RatesResponse {
    coinId: number;
    coinValue: number;
    currency: string;
    date: Date
}

@Injectable({providedIn: 'root'})
export class RateService {

    private rates: Rate[];
    private lastUpdateDate: Date;
    private requestUrl = 'http://localhost:8009/';

    constructor(
        private coinService: CoinServiceComponent,
        private currencyService: CurrencyServiceComponent,
        private loggingService: LoggingService,
        private http: HttpClient,
    ) {
        this.initService();
    }

    private initService(): void{
        var storedRates = StorageUtils.readFromStorage('rates');
        if (storedRates === null){
            this.rates = [];
        }
        else {
            this.rates = storedRates;
        }
    }

    public updateAllExchangeRates(){
        var now = moment();
        var tickersToUpdate = [];
        var userCurrency = this.currencyService.getCurrencySelected();
        //if rates are more than 1 hour old update, otherwise nothing
        this.rates?.forEach(rate => {
            if(moment().subtract(1, 'hour').toDate() < rate.updated){
                tickersToUpdate.push(rate.ticker)
            }
        });
        tickersToUpdate.forEach(ticker => {
            //var r = backend.getRate(ticker, userCurrency);
            var rate = new Rate("BTC", 2.457345, "EUR", now.toDate());
            rate.updated = now.toDate();
            this.rates.push(rate);
        });
        this.loggingService.info("RateService updated " + tickersToUpdate.length + " rates.")
        StorageUtils.writeToStorage("rates", this.rates);
    }

    public getLastUpdateDate(): Date {
        var date = new Date();
        this.rates?.forEach(rate => {
            if (rate.updated > date){
                date = rate.updated;
            }
        });
        return date;
    }

    public getRateForTicker(tickerToLookup: string): number{
        var userCurrency = this.currencyService.getCurrencySelected();
        //this.rates = StorageUtils.readFromStorage('rates');
        //console.log("rates: " + this.rates); //rates is null
        var foundRate = this.rates.find(i => i.ticker === tickerToLookup && i.currencyCode === userCurrency )
        if(foundRate != undefined){
            this.loggingService.info("RateService: found rate- ", foundRate);
            return foundRate.value;
        }
        else{
            this.loggingService.warn("RateService: no rate found for " + tickerToLookup + "-" + userCurrency + ".")
            return 0;
        }
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

      getConfigResponse(currency: string, coinId: number): Observable<HttpResponse<RatesResponse>> {
        return this.http.get<RatesResponse>(
            this.requestUrl + "?currency=" + currency + "?id=" + coinId, { observe: 'response' });
    }
}