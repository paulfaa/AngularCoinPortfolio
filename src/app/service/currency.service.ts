import { Injectable } from '@angular/core';
import { CurrencyEnum } from '../currencyEnum';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CurrencyService {

    private currencySelected: CurrencyEnum;

    public setCurrencySelected(currency: CurrencyEnum){
        this.currencySelected = currency;
        localStorage.setItem("currencySelected", this.currencySelected.toString());
        //window.location.reload(); should restart app on change
    }

    public getSelectedCurrencySymbol(): Observable<string>{
        var symbol = localStorage.getItem("currencySelected");
        switch(symbol){
            case 'EUR':
            case null:
                return of("€");
            case 'USD':
            case 'NZD':
                return of("$");
        }
    }

    public getSelectedCurrency(): CurrencyEnum{
        //default to EUR if nothing selected
        this.currencySelected = CurrencyEnum[localStorage.getItem("currencySelected")];
        if(this.currencySelected == null){
            this.currencySelected = CurrencyEnum.EUR;
        }
        return this.currencySelected;
    }
}