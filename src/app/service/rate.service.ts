import { Injectable, OnDestroy } from "@angular/core";
import StorageUtils from "../storage.utils";
import { Rate } from "../types/rate.type";
import { PurchasesService } from "./purchases.service";
import { CurrencyService } from "./currency.service";
import { LoggingService } from "./logging.service";
import { CryptoValueClientService } from "./crypto-value-client.service";
import { Observable, of, Subscription } from "rxjs";
import { element } from "protractor";
import { CurrencyEnum, enumToString } from "../types/currencyEnum";

@Injectable({providedIn: 'root'})
export class RateService implements OnDestroy{

    private rates: Rate[];
    private ratesLastUpdateDate: Date;
    private selectedCurrencySubscription: Subscription;
    private selectedCurrency: CurrencyEnum;

    constructor(
        private purchasesService: PurchasesService,
        private currencyService: CurrencyService,
        private loggingService: LoggingService,
        private http: CryptoValueClientService,
    ) {
        this.initService();
    }
    ngOnDestroy(): void {
        if(this.selectedCurrencySubscription){
            this.selectedCurrencySubscription.unsubscribe();
        };
    }

    private initService(): void{
        this.selectedCurrencySubscription = this.currencyService.getSelectedCurrency().subscribe(result =>
            this.selectedCurrency = result
        );
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

    public getRateForId(id: number): number | undefined{
        const currencyCode = enumToString(this.selectedCurrency);
        const matchingRate = this.rates.find(element => {
            element.id == id && element.currencyCode == currencyCode
        });
        if(matchingRate == undefined){
            console.log("no stored rate for : " + id)
            //return undefined;
            return 0;
        }
        else{
            console.log("rate found for id " + id + " was " + matchingRate.value)
            return matchingRate.value;
        }
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