import { CurrencyEnum } from "../currencyEnum";
import { Coin } from "./coin.type";
import { CoinName } from "./coinName.type";
import { PurchaseDetails } from "./purchaseDetails.type";
import { Value } from "./value.type";

export class CoinBuilder {

    private readonly _coin: Coin;

    constructor() {
        this._coin = {
            id: 0,
            name: new CoinName("", ""),
            purchaseDetails: new PurchaseDetails(0, CurrencyEnum.EUR, new Date()),
            value: new Value(0, CurrencyEnum.EUR, new Date()),
            quantity: 0,
            profit: 0,
            updateProfit: Coin.prototype.updateProfit
        };
    }

    id(id: number): CoinBuilder {
        this._coin.id = id;
        return this;
    }

    name(name: CoinName): CoinBuilder {
        this._coin.name = name;
        return this;
    }
    
    purchaseDetails(purchaseDetails: PurchaseDetails): CoinBuilder {
        this._coin.purchaseDetails = purchaseDetails;
        return this;
    }

    value(value: Value): CoinBuilder {
        this._coin.value = value;
        return this;
    }

    quantity(quantity: number): CoinBuilder {
        this._coin.quantity = quantity;
        return this;
    }

    profit(profit: number): CoinBuilder {
        this._coin.profit = profit;
        return this;
    }
    
    build(): Coin {
        return this._coin;
    }
}