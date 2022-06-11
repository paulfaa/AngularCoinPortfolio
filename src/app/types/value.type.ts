import { CurrencyEnum } from "../currencyEnum";

export class Value {
    private currentValue: number;
    private currency: CurrencyEnum;
    private dateValueUpdated: Date;
    

    constructor(currentValue: number, currency: CurrencyEnum, dateValueUpdated: Date){
        this.currentValue = currentValue;
        this.currency = currency;
        this.dateValueUpdated = dateValueUpdated;
    }

    public getCurrentValue(): number {
        return this.currentValue;
    }
    
    public setCurrentValue(value: number) {
        this.currentValue = value;
    }
    
    public getCurrency(): CurrencyEnum {
        return this.currency;
    }

    public setCurrency(value: CurrencyEnum) {
        this.currency = value;
    }

    public getDateValueUpdated(): Date {
        return this.dateValueUpdated;
    }

    public setDateValueUpdated(value: Date) {
        this.dateValueUpdated = value;
    }
}
