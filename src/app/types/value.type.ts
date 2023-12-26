import { Currency } from "./currency.type";

export class Value {
    public currentValue: number;
    public currency: Currency;
    public updateDate: Date;

    constructor(currentValue: number, currency: Currency, dateValueUpdated: Date){
        this.currentValue = currentValue;
        this.currency = currency;
        this.updateDate = dateValueUpdated;
    }

    public getCurrentValue(): number {
        return this.currentValue;
    }

    public setCurrentValue(value: number) {
        this.currentValue = value;
    }
    
    public getCurrency(): Currency {
        return this.currency;
    }

    public setCurrency(value: Currency) {
        this.currency = value;
    }

    public getUpdateDate(): Date {
        return this.updateDate;
    }

    public setUpdateDate(value: Date) {
        this.updateDate = value;
    }
}
