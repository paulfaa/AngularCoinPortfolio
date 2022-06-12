import { CoinName } from './coinName.type';
import { Value } from './value.type';

export class Coin {
    name: CoinName;
    searchString: string; // may not be needed, check usage
    purchasePrice: number;  // should create new class with number and currency
    value: Value;
    quantity: number;
    purchaseDate: Date;
    
    constructor(name: CoinName, cPurchasePrice?: number, cQuantity?: number, value?: Value){
        this.name = name;
        this.searchString = name.displayName + " - " + name.ticker;
        this.purchasePrice = cPurchasePrice;
        this.quantity = cQuantity;
        this.value = value;
        this.purchaseDate = new Date();
    }
}
  