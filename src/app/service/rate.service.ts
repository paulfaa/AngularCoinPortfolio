import { Injectable, OnDestroy } from "@angular/core";
import StorageUtils from "../storage.utils";
import { Rate } from "../types/rate.type";
import { PurchasesService } from "./purchases.service";
import { CurrencyService } from "./currency.service";
import { LoggingService } from "./logging.service";
import { CryptoValueClientService } from "./crypto-value-client.service";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { CurrencyEnum, enumToString } from "../types/currencyEnum";
import { twelveHoursInMs } from "../shared/constants/constants";
import * as moment from "moment";

@Injectable({providedIn: 'root'})
export class RateService implements OnDestroy{

    //private ratesSubject = new BehaviorSubject<Map<string, Rate>>(new Map<string, Rate>());
    //private rates$: Observable<Map<string, Rate>> = this.ratesSubject.asObservable();
    private ratesMap: Map<string, Rate>; //key is currency code
    private rates: Rate[];
    private ratesLastUpdateDate: Date | undefined;
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
        const storedRates = StorageUtils.readFromStorage('rates');
        const lastUpdateDate = StorageUtils.readFromStorage('lastUpdateDate');
        if (storedRates === null || storedRates.length == 0){
            this.rates = [];
        }
        else {
            this.rates = storedRates;
            this.ratesLastUpdateDate = this.rates[0].updateDate;
        }
        if(lastUpdateDate != null){
            this.ratesLastUpdateDate = lastUpdateDate;
        }
    }

    public updateAllExchangeRates(){
        if(this.ratesLastUpdateDate == undefined){
            this.callCryptoValueEndpoint();
            return;
        }
        const timeDifference = Math.abs(moment().toDate().getTime() - new Date(this.ratesLastUpdateDate).getTime());
        if(timeDifference <= twelveHoursInMs){ //should be >= changed for testing
            this.callCryptoValueEndpoint();
        }
        else{
            this.loggingService.info("No need to update, rates are newer than 12 hours old");
        }
    }

    private callCryptoValueEndpoint(){
        const currencyCode = enumToString(this.selectedCurrency);
        this.http.getCryptoValues(currencyCode).subscribe(data => {
            this.rates = data; //use map with currency as keys instead of all in one list
            console.log("RateService updated " + this.rates.length + " " + currencyCode + " rates.");
            this.ratesLastUpdateDate = new Date();
            StorageUtils.writeToStorage("rates", this.rates);
            StorageUtils.writeToStorage("lastUpdateDate", this.ratesLastUpdateDate);
        },
        error => {
            console.error("Error fetching data:", error);
            //need to show error on UI side here
          }
        );
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

    //remove this
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