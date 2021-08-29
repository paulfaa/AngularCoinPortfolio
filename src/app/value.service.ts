import { Component, Injectable, OnInit } from '@angular/core';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { IValue } from './types/value.interface';

//shoul probably be injected somewhere else
@Injectable({providedIn: 'root'})
export class CoinServiceComponent {

    public calculateTotalProfit(): number{
        //sum purchase price for each holding
        //sum current value for each holding
        //return value - purchase price
        return 0;
    }
}