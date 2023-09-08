import { Injectable } from '@angular/core';
import { CurrencyEnum, enumToString } from '../types/currencyEnum';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CurrencyService {
    
    private currencySubject = new BehaviorSubject<CurrencyEnum>(this.loadSavedCurrency());
    private currency$: Observable<CurrencyEnum> = this.currencySubject.asObservable();

    public getSelectedCurrency(): Observable<CurrencyEnum>{
        return this.currency$;
    }

    //can probably hnage back to accept enum directly
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
}