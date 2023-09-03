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
    private ratesLastUpdated: Date;
    private selectedCurrency;

    constructor(
        private purchasesService: PurchasesService,
        private currencyService: CurrencyService,
        private loggingService: LoggingService,
        private http: CryptoValueClientService,
    ) {
        this.initService();
    }

    private initService(): void{
        this.selectedCurrency = this.currencyService.getSelectedCurrency();
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
        this.http.getCryptoValues().subscribe(data => {this.rates = data});
        //var rate = new Rate("BTC", 2.457345, CurrencyEnum.EUR, now.toDate());
        //rate.updateDate = now.toDate();
        this.loggingService.info("RateService updated " + this.rates.length + " rates.")
        StorageUtils.writeToStorage("rates", this.rates);
    }

    public getLastUpdateDate(): Date {
        var date = new Date(2020, 11, 1);
        this.rates?.forEach(rate => {
            if (rate.updateDate > date){
                date = rate.updateDate;
            }
        });
        return date;
    }

    public getRateForTicker(tickerToLookup: string): number{
        var foundRate = this.rates.find(i => i.name === tickerToLookup && i.currencyCode === this.selectedCurrency )
        if(foundRate != undefined){
            this.loggingService.info("RateService: found rate - ", foundRate);
            return foundRate.value;
        }
        else{
            return 5;
            this.loggingService.warn("RateService: no rate found for " + tickerToLookup + " - " + this.selectedCurrency)
            return 0;
        }
    }
}