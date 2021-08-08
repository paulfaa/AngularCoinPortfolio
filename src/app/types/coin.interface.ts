import { IValue } from './value.interface';

export class Coin {
    value: IValue;
    quantity: number;
    name: string;
    ticker: string;

    constructor(cName: string, cTicker: string){
        this.name = cName;
        this.ticker = cTicker;
    }
}
  