import { IValue } from './value.interface';

export class Coin implements ICoin {
    name: string;
    ticker: string;
    searchString: string;
    purchasePrice: number;
    currentValue: number;
    //value?: IValue;
    quantity: number;
    purchaseDate: Date;

  constructor(coin: ICoin) {
    this.name = name;
      this.ticker = ticker;
      this.searchString = searchString;
      this.purchasePrice = purchasePrice;
      this.quantity = quantity;
      this.value = value;
      this.purchaseDate = date;
  }
}