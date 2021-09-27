import { Component, Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Coin } from './types/coin.interface';
import { CoinName } from './types/coinName.type';
import { Rate } from './types/rate.type';
import { IValue } from './types/value.interface';

//shoul probably be injected somewhere else
@Injectable({providedIn: 'root'})
export class CoinServiceComponent {

    private rates: Rate[];
    private ratesLastUpdated: Date;

    public calculateTotalProfit(): number{
        //sum purchase price for each holding
        //sum current value for each holding
        //return value - purchase price
        return 0;
    }

    public updateAllExchangeRates(){
        var now = moment()
        if(moment().subtract(1, 'hour') < now){
            //clear entire map
            //for each unique ticker in heldcoins
            //ratesMap.set
        }
        this.ratesLastUpdated = now.toDate();
      }
}