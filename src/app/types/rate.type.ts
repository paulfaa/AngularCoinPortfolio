export class Rate {
    id: number;
    name: string;
    currencyCode: string;
    value: number;
    updateDate: Date;

  constructor(id: number, ticker: string, value: number, currencyCode: string, updated: Date) {
    this.id = id;
      this.name = ticker;
      this.value = value;
      this.currencyCode = currencyCode;
      this.updateDate = updated;
  }

  public getValue(): number{
    return this.value;
  }
}