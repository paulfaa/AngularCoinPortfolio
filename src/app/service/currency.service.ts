import { Component, Injectable, OnInit } from '@angular/core';
import { CurrencyEnum } from '../currencyEnum';

@Injectable({providedIn: 'root'})
export class CurrencyService {

    private currencySelected: CurrencyEnum;

    public setCurrencySelected(currency: CurrencyEnum){
        this.currencySelected = currency;
        localStorage.setItem("currencySelected", this.currencySelected.toString());
        //window.location.reload(); should restart app on change
    }

    public getCurrencySymbol(): string{
        var symbol = localStorage.getItem("currencySelected");
        switch(symbol){
            case 'EUR':
            case null:
                return "€";
            case 'USD':
            case 'NZD':
                return "$";
        }
    }

    public getCurrencySelected(): CurrencyEnum{
        //default to EUR if nothing selected
        this.currencySelected = CurrencyEnum[localStorage.getItem("currencySelected")];
        if(this.currencySelected == null){
            this.currencySelected = CurrencyEnum.EUR;
        }
        return this.currencySelected;
    }
}