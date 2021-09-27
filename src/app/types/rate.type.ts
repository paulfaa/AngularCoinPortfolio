export class Rate {
    ticker: string;
    value: number;
    currencyCode: string;
    priceUpdated: Date;

  constructor(rTicker: string, rValue: number, rCurrencyCode: string, rPriceUpdated: Date) {
      this.ticker = rTicker;
      this.value = rValue;
      this.currencyCode = rCurrencyCode;
      this.priceUpdated = rPriceUpdated;
  }
}