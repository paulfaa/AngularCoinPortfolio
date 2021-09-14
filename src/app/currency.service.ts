import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { IValue } from './types/value.interface';

@Injectable({providedIn: 'root'})
export class CurrencyServiceComponent {

    private currencySelected: string;
    private lastUpdate: Date;

    public setCurrencySelected(currency: string){
        this.currencySelected = currency;
        localStorage.setItem("currencySelected", this.currencySelected);
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
        return 0;
    }
}