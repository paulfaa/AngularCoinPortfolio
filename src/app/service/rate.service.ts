import { Injectable } from "@angular/core";
import StorageUtils from "../storage.utils";
import { Rate } from "../types/rate.type";
import { PurchasesService } from "./purchases.service";
import { CurrencyService } from "./currency.service";
import { LoggingService } from "./logging.service";
import { CryptoValueClientService } from "./crypto-value-client.service";
import { Observable, of } from "rxjs";

@Injectable({providedIn: 'root'})
export class RateService {

    private rates: Rate[];
    private ratesLastUpdateDate: Date;
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
        if (storedRates === null || storedRates.length == 0){
            this.rates = [];
        }
        else {
            this.rates = storedRates;
            this.ratesLastUpdateDate = this.rates[0].updateDate;
        }
    }

    public updateAllExchangeRates(){
        this.http.getCryptoValues().subscribe(data => {this.rates = data});
        //var rate = new Rate("BTC", 2.457345, CurrencyEnum.EUR, now.toDate());
        //rate.updateDate = now.toDate();
        this.loggingService.info("RateService updated " + this.rates.length + " rates.")
        StorageUtils.writeToStorage("rates", this.rates);
        this.ratesLastUpdateDate = new Date();
    }

    public getRatesLastUpdateDate(): Observable<Date> {
        return of(this.ratesLastUpdateDate);
    }

    public getRateForTicker(tickerToLookup: string): number{
        return 5;
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