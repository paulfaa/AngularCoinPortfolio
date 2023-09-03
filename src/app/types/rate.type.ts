import { CurrencyEnum } from "../currencyEnum";

export class Rate {
    id: number;
    name: string;
    currencyCode: CurrencyEnum;
    value: number;
    updateDate: Date;

  constructor(rTicker: string, rValue: number, rCurrencyCode: CurrencyEnum, rUpdated: Date) {
      this.name = rTicker;
      this.value = rValue;
      this.currencyCode = rCurrencyCode;
      this.updateDate = rUpdated;
  }

  public getValue(): number{
    return this.value;
  }
}