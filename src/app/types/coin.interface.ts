import { IValue } from './value.interface';

export class Coin {
    name: string;
    ticker: string;
    searchString: string;
    purchasePrice: number;
    value: number;
    //value?: IValue;
    quantity: number;
    purchaseDate: Date;

    constructor(cName: string, cTicker?: string, cPurchasePrice?: number, cQuantity?: number, cValue?: number){
        this.name = cName;
        this.ticker = cTicker;
        this.searchString = cName + " - " + cTicker;
        this.purchasePrice = cPurchasePrice;
        this.quantity = cQuantity;
        this.value = cValue;
        this.purchaseDate = new Date();
    }
}
  