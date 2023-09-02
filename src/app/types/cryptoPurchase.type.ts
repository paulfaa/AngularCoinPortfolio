import { CryptoName } from './cryptoName.type';
import { PurchaseDetails } from './purchaseDetails.type';
import { Value } from './value.type';

export class CryptoPurchase {
    id: number;
    name: CryptoName;
    purchaseDetails: PurchaseDetails;
    value: Value;
    quantity: number;
    profit: number; //should be an object with currencyValue
    
    constructor(name: CryptoName, purchaseDetails?: PurchaseDetails, quantity?: number, value?: Value){
        this.name = name;
        this.purchaseDetails = purchaseDetails;
        this.quantity = quantity;
        this.value = value;
    }

    public updateProfit(): void{
        this.profit = this.value.getCurrentValue() - this.purchaseDetails.price;
    }
}
  