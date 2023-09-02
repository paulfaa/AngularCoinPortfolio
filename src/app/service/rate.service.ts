import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, throwError } from "rxjs";
import { CurrencyEnum } from "../currencyEnum";
import StorageUtils from "../storage.utils";
import { Rate } from "../types/rate.type";
import { PurchasesService } from "./purchases.service";
import { CurrencyService } from "./currency.service";
import { LoggingService } from "./logging.service";
import { CryptoValueClientService } from "./crypto-value-client.service";

@Injectable({providedIn: 'root'})
export class RateService {

    private rates: Rate[];
    private lastUpdateDate: Date;
    private selectedCurrency;

    constructor(
        private coinService: PurchasesService,
        private currencyService: CurrencyService,
        private loggingService: LoggingService,
        private http: CryptoValueClientService,
    ) {
        this.initService();
    }

    private initService(): void{
        this.selectedCurrency = this.currencyService.getCurrencySelected();
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
        //if rates are more than 12 hours old update, otherwise nothing
        this.rates?.forEach(rate => {
            if(moment().subtract(12, 'hour').toDate() < rate.updated){
                tickersToUpdate.push(rate.ticker)
            }
        });
        tickersToUpdate.forEach(ticker => {
            //var r = backend.getRate(ticker, userCurrency);
            var rate = new Rate("BTC", 2.457345, CurrencyEnum.EUR, now.toDate());
            rate.updated = now.toDate();
            this.rates.push(rate);
        });
        this.loggingService.info("RateService updated " + tickersToUpdate.length + " rates.")
        StorageUtils.writeToStorage("rates", this.rates);
    }

    public getLastUpdateDate(): Date {
        var date = new Date(2020, 11, 1);
        this.rates?.forEach(rate => {
            if (rate.updated > date){
                date = rate.updated;
            }
        });
        return date;
    }

    public getRateForTicker(tickerToLookup: string): number{
        var foundRate = this.rates.find(i => i.ticker === tickerToLookup && i.currencyCode === this.selectedCurrency )
        if(foundRate != undefined){
            this.loggingService.info("RateService: found rate - ", foundRate);
            return foundRate.value;
        }
        else{
            this.loggingService.warn("RateService: no rate found for " + tickerToLookup + "-" + this.selectedCurrency.toString() + ".")
            return 0;
        }
    }
}