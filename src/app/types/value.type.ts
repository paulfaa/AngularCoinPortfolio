import { CurrencyEnum } from "./currencyEnum";

export class Value {
    public currentValue: number;
    public currency: CurrencyEnum;
    public updateDate: Date;

    constructor(currentValue: number, currency: CurrencyEnum, dateValueUpdated: Date){
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
    
    public getCurrency(): CurrencyEnum {
        return this.currency;
    }

    public setCurrency(value: CurrencyEnum) {
        this.currency = value;
    }

    public getUpdateDate(): Date {
        return this.updateDate;
    }

    public setUpdateDate(value: Date) {
        this.updateDate = value;
    }
}
