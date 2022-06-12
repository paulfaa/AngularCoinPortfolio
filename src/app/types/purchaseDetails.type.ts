import { CurrencyEnum } from "../currencyEnum";

export class PurchaseDetails {
    price: number;
    currency: CurrencyEnum;
    date: Date;

    constructor(price: number, currency: CurrencyEnum, date: Date) {
        this.price = price;
        this.currency = currency;
        this.date = date;
    }
}