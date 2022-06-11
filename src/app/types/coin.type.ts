import { CurrencyEnum } from '../currencyEnum';
import { Value } from './value.type';

export class Coin {
    name: string;
    ticker: string;
    searchString: string;
    purchasePrice: number;
    currentValue: Value;
    quantity: number;
    purchaseDate: Date;
    
    constructor(cName: string, cTicker?: string, cPurchasePrice?: number, cQuantity?: number, value?: Value){
        this.name = cName;
        this.ticker = cTicker;
        this.searchString = cName + " - " + cTicker;
        this.purchasePrice = cPurchasePrice;
        this.quantity = cQuantity;
        this.currentValue = value;
        this.purchaseDate = new Date();
    }
}
  