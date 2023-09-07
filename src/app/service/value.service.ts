import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { PurchasesService } from './purchases.service';
import { RateService } from './rate.service';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { Value } from '../types/value.type';
import { CurrencyService } from './currency.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';

@Injectable({providedIn: 'root'})
export class ValueService implements OnDestroy {

    //duplicating data from purchaseservice here
    private purchases: CryptoPurchase[];
    private purchasesSubscription: Subscription;

    private totalValueSubject = new BehaviorSubject<number>(0);
    private totalValue$: Observable<number> = this.totalValueSubject.asObservable();

    private totalProfitSubject = new BehaviorSubject<number>(0);
    private totalProfit$: Observable<number> = this.totalProfitSubject.asObservable();

    constructor(
        private purchasesService: PurchasesService,
        private rateService: RateService,
        private currencyService: CurrencyService
    ) {
        this.purchasesSubscription = this.purchasesService.getAllPurchases().subscribe(purchases => {
            console.log("purchasesSubscription updated")
            this.purchases = purchases
            this.calculateTotalValue();
            this.calculateTotalProfit();
        });
    }
    ngOnDestroy(): void {
        if(this.purchasesSubscription){
            this.purchasesSubscription.unsubscribe();
        }
    }
    
    public getTotalValue(): Observable<number> {
        return this.totalValue$;
    }

    public getTotalProfit(): Observable<number> {
        return this.totalProfit$;
    }

    public createNewValue(currentValue: number): Value{
        return new Value(currentValue, CurrencyEnum.EUR, moment().toDate()); //fix this, changed to EUR for testing
    }

    public calculateTotalProfit(): number{
        const totalExpendature = this.calculateTotalExpenditure()
        const totalValue = this.calculateTotalValue();
        const totalProfit = totalValue - totalExpendature;
        //this.totalValueSubject.next(totalValue);
        //this.totalProfitSubject.next(totalValue - totalExpendature);
        console.log("totalProfit value.service ", this.totalProfit$)
        return totalProfit;
    }

    private calculateTotalValue(): number{
        const currentValue = this.totalValueSubject.getValue()
        this.totalValueSubject.next(currentValue + 5) //fix
        var total = 0;
        const allTickers = this.purchasesService.getAllUniqueTickers();
        //console.log("alltickers: " , allTickers)
        if(allTickers != null && allTickers.size >= 1){
            allTickers.forEach(ticker => { 
                total = total + (this.purchasesService.getAmountHeldOfTicker(ticker) * this.rateService.getRateForTicker(ticker));
                console.log("total: ", total)
            });
        }
        console.log("Value service total: "+ total);
        return total;
    }

    private calculateTotalExpenditure(): number{
        var expenditure = this.purchases.reduce((total, purchase) => total + purchase.purchaseDetails.price, 0);
        console.log("total expendeture: ", expenditure)
        return expenditure;
    }

    //refactor to use id instead
    public calculateValueForTicker(ticker: string): number{
        //this.updateAllExchangeRates();
        console.log("value: " + this.rateService.getRateForTicker(ticker) * this.purchasesService.getAmountHeldOfTicker(ticker));
        //var rate = this.rateService.getRateForTicker(ticker); //always returning 0
        return this.rateService.getRateForTicker(ticker) * this.purchasesService.getAmountHeldOfTicker(ticker);
    }

    /* public updateValueForSingleCoin(purchase: CryptoPurchase): void{
        var updatedValue = purchase.quantity * this.rateService.getRateForTicker(purchase.name.ticker)
        purchase.value.setCurrentValue(updatedValue);
    }

    public updateValueForTicker(ticker: string): void{
        if(this.purchases != null){
            this.purchases.forEach(purchase => {
                if(purchase.name.ticker == ticker){
                    this.updateValueForSingleCoin(purchase);
                }
            });
        }
    } */
}