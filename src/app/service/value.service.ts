import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { PurchasesService } from './purchases.service';
import { RateService } from './rate.service';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { Value } from '../types/value.type';
import { CurrencyService } from './currency.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';
import { map } from 'rxjs/operators';

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
            this.purchases = purchases
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

    public getPercentageProfit(): Observable<number> {
        return this.totalProfit$.pipe(
            map(totalProfit => (totalProfit / this.totalValueSubject.value) * 100)
        );
    }

    public createNewValue(currentValue: number, selectedCurrency: CurrencyEnum): Value{
        return new Value(currentValue, selectedCurrency, moment().toDate());
    }

    public calculateTotalProfit(): number{
        const totalExpendature = this.calculateTotalExpenditure()
        const totalValue = this.calculateTotalValue();
        const totalProfit = totalValue - totalExpendature;
        this.totalValueSubject.next(totalValue);
        this.totalProfitSubject.next(totalProfit);
        console.log("totalProfit value.service ", this.totalProfit$)
        return totalProfit;
    }

    private calculateTotalValue(): number{
        var total = 0;
        const allIds = this.purchasesService.getAllUniqueIds();
        allIds.forEach(id => {
            const quantity = this.purchasesService.getQuantityHeldById(id);
            const rate = this.rateService.getRateForId(id); //race condition, getting called before rateService is ready
            if(quantity && rate){
                total = total + (quantity * rate);
            }
        })
        console.log("Value service total: "+ total);
        return total;        
    }

    private calculateTotalExpenditure(): number{
        var expenditure = this.purchases.reduce((total, purchase) => total + purchase.purchaseDetails.price, 0);
        console.log("total expenditure: ", expenditure)
        return expenditure;
    }

    public calculateValueForId(coinMarketId: number): number{
        const value = this.rateService.getRateForId(coinMarketId) * this.purchasesService.getQuantityHeldById(coinMarketId);
        console.log("value caclulated for all holdings of " + coinMarketId + " - " + value)
        return value;
    }

    /* public updateValueForSingleCoin(purchase: CryptoPurchase): void{
        var updatedValue = purchase.quantity * this.rateService.getRateForTicker(purchase.name.ticker)
        purchase.value.setCurrentValue(updatedValue);
    } ^&*/
}