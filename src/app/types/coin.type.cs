import { ICoin } from './coin.interface';

export class Coin implements ICoin {
    value: IValue;
    quantity: number;
    name: string;
    ticker: string;

  constructor(coin: ICoin) {
      this.value = value;
      this.quantity = quantity;
      this.name = name;
      this.ticker = ticker;
  }
}