import * as moment from "moment";
import { CurrencyEnum } from "./currencyEnum";
import { CryptoPurchaseBuilder } from "./cryptoPurchase.builder";
import { CryptoPurchase } from "./cryptoPurchase.type";
import { CryptoName } from "./cryptoName.type";
import { PurchaseDetails } from "./purchaseDetails.type";
import { Value } from "./value.type";
import { Currency } from "./currency.type";

describe('CryptoPurchaseBuilder', () => {
    it('returns a CryptoPurchase object with the specified parameters', () => {
        // Arrange
        const id = 123;
        const name = new CryptoName("Cardano", "Ada", 12);
        const purchaseDetails = new PurchaseDetails(12.2346, new Currency("EUR", "€"), moment().toDate());
        const value = new Value(5.7363, new Currency("EUR", "€"),  moment().toDate());
        const profit = 44.573;
        const quantity = 0.075;
        const testCoin = new CryptoPurchase(name, purchaseDetails, quantity, value);
        testCoin.profit = profit;

        // Act
        const builtCoin = new CryptoPurchaseBuilder()
            .name(name)
            .profit(profit)
            .purchaseDetails(purchaseDetails)
            .quantity(quantity)
            .value(value)
            .build();

        // Assert
        expect(builtCoin.name).toEqual(testCoin.name);
        expect(builtCoin.purchaseDetails).toEqual(testCoin.purchaseDetails);
        expect(builtCoin.quantity).toEqual(testCoin.quantity);
        expect(builtCoin.value).toEqual(testCoin.value);
    });

    it('can ignore optional parameters', () => {
        // Arrange
        const name = new CryptoName("Cardano", "Ada", 12);
        const purchaseDetails = new PurchaseDetails(12.2346, new Currency("EUR", "€"), moment().toDate());
        const value = new Value(5.7363, new Currency("EUR", "€"),  moment().toDate());
        const quantity = 0.075;
        const testCoin = new CryptoPurchase(name, purchaseDetails, quantity, value);

        // Act
        const builtCoin = new CryptoPurchaseBuilder()
            .name(name)
            .purchaseDetails(purchaseDetails)
            .quantity(quantity)
            .value(value)
            .build();

        // Assert
        expect(builtCoin.name).toEqual(testCoin.name);
        expect(builtCoin.purchaseDetails).toEqual(testCoin.purchaseDetails);
        expect(builtCoin.quantity).toEqual(testCoin.quantity);
        expect(builtCoin.value).toEqual(testCoin.value);
    });
});