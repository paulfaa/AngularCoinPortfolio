import { CoinName } from './coinName.type';
import { PurchaseDetails } from './purchaseDetails.type';
import { Value } from './value.type';

// add builder class
export class Coin {
    name: CoinName;
    purchaseDetails: PurchaseDetails;
    value: Value;
    quantity: number;
    profit: number;
    
    constructor(name: CoinName, purchaseDetails?: PurchaseDetails, quantity?: number, value?: Value){
        this.name = name;
        this.purchaseDetails = purchaseDetails;
        this.quantity = quantity;
        this.value = value;
    }

    public updateProfit(): void{
        this.profit = this.value.getCurrentValue() - this.purchaseDetails.price;
    }
}
  