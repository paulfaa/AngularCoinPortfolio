export class Rate {
    ticker: string;
    value: number;
    currencyCode: string;
    updated: Date;

  constructor(rTicker: string, rValue: number, rCurrencyCode: string, rUpdated: Date) {
      this.ticker = rTicker;
      this.value = rValue;
      this.currencyCode = rCurrencyCode;
      this.updated = rUpdated;
  }

  public getValue(): number{
    return this.value;
  }
}