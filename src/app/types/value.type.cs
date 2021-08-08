import { IValue } from './value.interface';

export class Value implements IValue {
    price: number;
    currencyCode: string;
    priceUpdated: Date;

  constructor(coin: ICoin) {
    this.price = price;
    this.currencyCode = currencyCode;
    this.priceUpdated = priceUpdated;
  }
}