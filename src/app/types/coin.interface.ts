import { IValue } from './value.interface';

export class Coin {
    name: string;
    ticker: string;
    searchString: string;
    value: number;
    //value?: IValue;
    quantity: number;
    purchaseDate: Date;

    constructor(cName: string, cTicker?: string, cValue?: number, cQuantity?: number){
        this.name = cName;
        this.ticker = cTicker;
        this.value = cValue;
        this.searchString = cName + " - " + cTicker;
        this.purchaseDate = new Date();
    }
}
  