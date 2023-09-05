import { Injectable } from '@angular/core';
import { CurrencyEnum, enumToString } from '../currencyEnum';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CurrencyService {

    //private currencySelected: CurrencyEnum;
    
    private currencySubject = new BehaviorSubject<CurrencyEnum>(this.loadSavedCurrency());
    private currency$ = this.currencySubject.asObservable();

    public getSelectedCurrency(): Observable<CurrencyEnum>{
        return this.currency$;
    }
    public setSelectedCurrency(c: string){
        const currency = CurrencyEnum[c];
        this.currencySubject.next(currency);
        localStorage.setItem("currencySelected", enumToString(currency));
    }
    private loadSavedCurrency(): CurrencyEnum{
        const storedCurrency = CurrencyEnum[localStorage.getItem("currencySelected")];
        if(storedCurrency == null){
            localStorage.setItem("currencySelected", enumToString(CurrencyEnum.EUR));
            return CurrencyEnum.EUR;
        }
        else{
            return storedCurrency;
        }
    } 

    /* public setCurrencySelected(currency: CurrencyEnum){
        this.currencySelected = currency;
        localStorage.setItem("currencySelected", this.currencySelected.toString());
    } */

    public getSelectedCurrencySymbol(): Observable<string>{
        var symbol = localStorage.getItem("currencySelected");
        console.log("getSelectedCurrencySymbol(): ", symbol)
        switch(symbol){
            case 'EUR':
            case null:
                console.log("€");
                return of("€");
            case 'USD':
            case 'AUD':
            case 'NZD':
                console.log("$");
                return of("$");
        }
    }

    /* public getSelectedCurrency(): Observable<CurrencyEnum>{
        //default to EUR if nothing selected
        this.currencySelected = CurrencyEnum[localStorage.getItem("currencySelected")];
        if(this.currencySelected == null){
            this.currencySelected = CurrencyEnum.EUR;
        }
        return of(this.currencySelected);
    } */
}