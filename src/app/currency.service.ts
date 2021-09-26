import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { IValue } from './types/value.interface';

@Injectable({providedIn: 'root'})
export class CurrencyServiceComponent {

    //not sure should be public or private
    public currencySelected: string;
    private lastUpdate: Date;

    public setCurrencySelected(currency: string){
        this.currencySelected = currency;
        localStorage.setItem("currencySelected", this.currencySelected);
    }

    public getCurrencySymbol(): string{
        var symbol = localStorage.getItem("currencySelected");
        switch(symbol){
            case 'EUR':
            case null:
                return "€";
            case 'USD':
            case 'AUD':
            case 'NZD':
                return "$";
        }
    }

    public getCurrencySelected(): string{
        //default to EUR if nothing selected
        this.currencySelected = localStorage.getItem("currencySelected");
        if(this.currencySelected == null){
            this.currencySelected = "EUR"
        }
        return this.currencySelected;
    }

    public calculateTotalProfit(): number{
        //sum purchase price for each holding
        //sum current value for each holding
        //return value - purchase price
        return 12345.6789;
    }
}