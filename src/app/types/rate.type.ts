import { CurrencyEnum } from "../currencyEnum";

export class Rate {
    ticker: string;
    value: number;
    currencyCode: CurrencyEnum;
    updated: Date;

  constructor(rTicker: string, rValue: number, rCurrencyCode: CurrencyEnum, rUpdated: Date) {
      this.ticker = rTicker;
      this.value = rValue;
      this.currencyCode = rCurrencyCode;
      this.updated = rUpdated;
  }

  public getValue(): number{
    return this.value;
  }
}