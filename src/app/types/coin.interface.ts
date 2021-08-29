import { IValue } from './value.interface';

export class Coin {
    name: string;
    ticker: string;
    value?: IValue;
    quantity?: number;
    purchaseDate?: Date;

    constructor(cName: string, cTicker: string){
        this.name = cName;
        this.ticker = cTicker;
    }
}
  