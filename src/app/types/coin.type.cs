import { IValue } from './value.interface';

export class Coin implements ICoin {
    name: string;
    ticker: string;
    quantity: number;
    value: IValue;
    purchaseDate: Date;
    
  constructor(coin: ICoin) {
      this.value = value;
      this.quantity = quantity;
      this.name = name;
      this.ticker = ticker;
      this.purchaseDate = date;
  }
}