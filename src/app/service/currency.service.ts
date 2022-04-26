import { Component, Injectable, OnInit } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CurrencyService {

    private currencySelected: string; //should use enum here

    public setCurrencySelected(currency: string){
        this.currencySelected = currency;
        localStorage.setItem("currencySelected", this.currencySelected);
        //window.location.reload(); should restart app on change
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
}