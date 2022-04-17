import { CurrencyEnum } from "../currencyEnum";

export interface IValue {
    currentValue: number;
    currency: CurrencyEnum
    //currencyCode: string;
    priceUpdated: Date;
}
