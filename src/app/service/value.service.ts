import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { PurchasesService } from './purchases.service';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { Value } from '../types/value.type';
import { SettingsService } from '../service/settings.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { CurrencyEnum, enumToString } from '../types/currencyEnum';
import { map } from 'rxjs/operators';
import { Rate } from '../types/rate.type';
import { LoggingService } from './logging.service';
import { CryptoValueClientService } from './crypto-value-client.service';
import StorageUtils from '../storage.utils';
import { twelveHoursInMs } from '../shared/constants/constants';

@Injectable({ providedIn: 'root' })
export class ValueService implements OnDestroy {

    private purchases: CryptoPurchase[];
    private purchasesSubscription: Subscription;
    private selectedCurrencySubscription: Subscription;
    private totalValueSubject = new BehaviorSubject<number>(0);
    private totalProfitSubject = new BehaviorSubject<number>(0);
    private totalValue$: Observable<number> = this.totalValueSubject.asObservable();
    private totalProfit$: Observable<number> = this.totalProfitSubject.asObservable();
    private ratesMap: Map<string, Rate[]>;
    private ratesLastUpdateDate: Date | undefined;
    private selectedCurrency: CurrencyEnum;

    public httpErrorEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private purchasesService: PurchasesService,
        private settingsService: SettingsService,
        private loggingService: LoggingService,
        private clientService: CryptoValueClientService
    ) {
        this.initService();
        this.updateAllExchangeRates();
        this.purchasesSubscription = this.purchasesService.getAllPurchases().subscribe(purchases => {
            this.purchases = purchases
            this.calculateTotalProfit();
        });
    }

    public ngOnDestroy(): void {
        if (this.purchasesSubscription) {
            this.purchasesSubscription.unsubscribe();
        }
        if (this.selectedCurrencySubscription) {
            this.selectedCurrencySubscription.unsubscribe();
        };
    }

    private initService(): void {
        this.selectedCurrencySubscription = this.settingsService.getSelectedCurrency().subscribe(result =>
            this.selectedCurrency = result
        );
        const storedRates = StorageUtils.readMapFromStorage('rates');
        const lastUpdateDate = StorageUtils.readFromStorage('lastUpdateDate');
        if (storedRates === null || storedRates.size == 0 || storedRates === undefined) {
            this.ratesMap = new Map<string, Rate[]>();
        }
        else {
            this.ratesMap = storedRates;
        }
        if (lastUpdateDate != null) {
            this.ratesLastUpdateDate = lastUpdateDate;
        }
    }

    public updateAllExchangeRates(): void {
        if (this.ratesLastUpdateDate == undefined) {
            this.callCryptoValueEndpoint();
            return;
        }
        const timeDifference = Math.abs(moment().toDate().getTime() - new Date(this.ratesLastUpdateDate).getTime());
        if (timeDifference <= twelveHoursInMs) { //should be >= but changed for testing
            this.loggingService.info("Rates are outdates, calling backend");
            this.callCryptoValueEndpoint();
        }
        else {
            this.loggingService.info("No need to update, rates are newer than 12 hours old");
        }
    }

    private callCryptoValueEndpoint(): void {
        const currencyCode = enumToString(this.selectedCurrency);
        this.clientService.getCryptoValues(currencyCode, this.purchasesService.getAllUniqueIds()).subscribe(data => {
            console.log(data)
            this.ratesMap.set(currencyCode, data);
            console.log("ValueService updated " + data.length + " " + currencyCode + " rates.");
            this.ratesLastUpdateDate = new Date();
            StorageUtils.writeMapToStorage("rates", this.ratesMap);
            StorageUtils.writeToStorage("lastUpdateDate", this.ratesLastUpdateDate);
        },
            error => {
                console.error("Error fetching data:", error);
                this.httpErrorEvent.emit('HTTP call failed');
            }
        );
    }

    public getRatesLastUpdateDate(): Observable<Date> {
        return of(this.ratesLastUpdateDate);
    }

    public getRateForId(id: number): number | undefined {
        const currencyCode = enumToString(this.selectedCurrency);
        const matchingRates = this.ratesMap.get(currencyCode)
        if (matchingRates != undefined) {
            const matchingRate = matchingRates.find(element => {
                return element.id == id && element.currencyCode == currencyCode
            });
            if (matchingRate == undefined) {
                //console.log("no stored rate for id: " + id)
                return undefined;
            }
            else {
                console.log(`${currencyCode} rate found for id ${id} was ` + matchingRate.value)
                return matchingRate.value;
            }
        }
        else {
            console.log(`no stored rates for currency ${currencyCode}!`)
        }
    }

    public getTotalValue(): Observable<number> {
        return this.totalValue$;
    }

    public getTotalProfit(): Observable<number> {
        return this.totalProfit$;
    }

    public getPercentageProfit(): Observable<number> {
        return this.totalProfit$.pipe(
            map(totalProfit => (totalProfit / this.totalValueSubject.value) * 100)
        );
    }

    public createNewValue(currentValue: number, selectedCurrency: CurrencyEnum): Value {
        return new Value(currentValue, selectedCurrency, moment().toDate());
    }

    public calculateTotalProfit(): number {
        const totalExpendature = this.calculateTotalExpenditure()
        const totalValue = this.calculateTotalValue();
        const totalProfit = totalValue - totalExpendature;
        this.totalValueSubject.next(totalValue);
        this.totalProfitSubject.next(totalProfit);
        console.log("totalProfit value.service ", this.totalProfit$)
        return totalProfit;
    }

    private calculateTotalValue(): number {
        var total = 0;
        const allIds = this.purchasesService.getAllUniqueIds();
        allIds.forEach(id => {
            const quantity = this.purchasesService.getQuantityHeldById(id);
            const rate = this.getRateForId(id);
            if (quantity && rate) {
                total = total + (quantity * rate);
            }
        })
        console.log("total value calculated: " + total);
        this.totalValueSubject.next(total);
        return total;
    }

    private calculateTotalExpenditure(): number {
        var expenditure = this.purchases.reduce((total, purchase) => total + purchase.purchaseDetails.price, 0);
        console.log("total expenditure: ", expenditure)
        return expenditure;
    }

    /* public calculateValueForId(coinMarketId: number): number{
        const value = this.getRateForId(coinMarketId) * this.purchasesService.getQuantityHeldById(coinMarketId);
        console.log("value caclulated for all holdings of " + coinMarketId + " - " + value)
        return value;
    } */
}