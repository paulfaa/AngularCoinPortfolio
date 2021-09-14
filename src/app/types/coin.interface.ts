import { IValue } from './value.interface';
import { CurrencyServiceComponent } from '../currency.service';

export class Coin {
    name: string;
    ticker: string;
    searchString: string;
    purchasePrice: number;
    currentValue: number;
    //value?: IValue;
    quantity: number;
    purchaseDate: Date;
    purchaseCurrency: string;

    constructor(cName: string, cTicker?: string, cPurchasePrice?: number, cQuantity?: number, cValue?: number){
        this.name = cName;
        this.ticker = cTicker;
        this.searchString = cName + " - " + cTicker;
        this.purchasePrice = cPurchasePrice;
        this.quantity = cQuantity;
        this.currentValue = cValue;
        this.purchaseDate = new Date();
        //this.purchaseCurrency = currencyServiceComponent.getCurrencySelected();
    }
}
  