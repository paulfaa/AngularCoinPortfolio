import { Component, Injectable, OnInit } from '@angular/core';
import { PurchasesService } from './purchases.service';
import { RateService } from './rate.service';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { Value } from '../types/value.type';
import { CurrencyService } from './currency.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';

@Injectable({providedIn: 'root'})
export class ValueService {

    //duplicating data from purchaseservice here
    private purchases: CryptoPurchase[];

    private purchasesSubscription: Subscription;
    private totalValue = 0;
    private totalProfit = 0;

    private totalValueSubject = new BehaviorSubject<number>(this.calculateTotalValue());
    private totalValue$: Observable<number> = this.totalValueSubject.asObservable();

    private totalProfitSubject = new BehaviorSubject<number>(this.calculateTotalProfit());
    private totalProfit$: Observable<number> = this.totalProfitSubject.asObservable();

    constructor(
        private purchasesService: PurchasesService,
        private rateService: RateService,
        private currencyService: CurrencyService
    ) {
        this.purchasesSubscription = this.purchasesService.getAllPurchases().subscribe(purchases => {this.purchases = purchases});
    }
    
    public getTotalValue(): Observable<number> {
        return this.totalValue$;
    }

    public getTotalProfit(): Observable<number> {
        return this.totalProfit$;
    }

    public createNewValue(currentValue: number): Value{
        return new Value(currentValue, CurrencyEnum.EUR, moment().toDate());
    }

    public calculateTotalProfit(): number{
        var totalExpendature = this.calculateTotalExpenditure();
        this.totalValue = this.calculateTotalValue();
        this.totalProfit = this.totalValue - totalExpendature;
        console.log("totalProfit value.service ", this.totalProfit)
        return this.totalProfit;
    }

    private calculateTotalValue(): number{
        var total = 0;
        //this.rateService.updateAllExchangeRates();
        var allTickers = this.purchasesService.getAllUniqueTickers();
        if(allTickers != null && allTickers.length >= 1){
            allTickers.forEach(ticker => {
                total = total + (this.purchasesService.getAmountHeldOfTicker(ticker) * this.rateService.getRateForTicker(ticker));
            });
        }
        this.totalValue = total;
        console.log("Value service total: "+ total);
        return total;
    }

    private calculateTotalExpenditure(): number{
        var expenditure = 0;
        //var purchases = this.purchasesService.getAllPurchases();
        if(this.purchases != null){
            this.purchases.forEach(purchase => {
                expenditure = expenditure + purchase.purchaseDetails.price;
            });
        }
        return expenditure;
      }

    public calculateValueForTicker(ticker: string): number{
        //this.updateAllExchangeRates();
        console.log("value: " + this.rateService.getRateForTicker(ticker) * this.purchasesService.getAmountHeldOfTicker(ticker));
        //var rate = this.rateService.getRateForTicker(ticker); //always returning 0
        return this.rateService.getRateForTicker(ticker) * this.purchasesService.getAmountHeldOfTicker(ticker);
    }

    public updateValueForSingleCoin(purchase: CryptoPurchase): void{
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
    }
}