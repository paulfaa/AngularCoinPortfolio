import { Currency } from "./currency.type";

export class PurchaseDetails {
    price: number;
    currency: Currency;
    date: Date;

    constructor(price: number, currency: Currency, date: Date) {
        this.price = price;
        this.currency = currency;
        this.date = date;
    }
}