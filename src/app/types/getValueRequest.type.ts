import { CurrencyEnum } from "./currencyEnum";

export class GetValueRequest {
    private ids: number[];
    private currency: CurrencyEnum;

    constructor(ids: number[], currency: CurrencyEnum){
        this.ids = ids;
        this.currency = currency;
    }
}