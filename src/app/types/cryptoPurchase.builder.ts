import { CurrencyEnum } from "./currencyEnum";
import { CryptoPurchase } from "./cryptoPurchase.type";
import { CryptoName } from "./cryptoName.type";
import { PurchaseDetails } from "./purchaseDetails.type";
import { Value } from "./value.type";
import { Currency } from "./currency.type";

export class CryptoPurchaseBuilder {

    private readonly purchase: CryptoPurchase;

    constructor() {
        this.purchase = {
            name: new CryptoName("", "", 0),
            purchaseDetails: new PurchaseDetails(0, new Currency("EUR", "€"), new Date()),
            value: new Value(0, new Currency("EUR", "€"), new Date()),
            quantity: 0,
            profit: 0,
            updateProfit: CryptoPurchase.prototype.updateProfit
        };
    }

    name(name: CryptoName): CryptoPurchaseBuilder {
        this.purchase.name = name;
        return this;
    }
    
    purchaseDetails(purchaseDetails: PurchaseDetails): CryptoPurchaseBuilder {
        this.purchase.purchaseDetails = purchaseDetails;
        return this;
    }

    value(value: Value): CryptoPurchaseBuilder {
        this.purchase.value = value;
        return this;
    }

    quantity(quantity: number): CryptoPurchaseBuilder {
        this.purchase.quantity = quantity;
        return this;
    }

    profit(profit: number): CryptoPurchaseBuilder {
        this.purchase.profit = profit;
        return this;
    }
    
    build(): CryptoPurchase {
        return this.purchase;
    }
}