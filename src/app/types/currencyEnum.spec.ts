import { CurrencyEnum, currencyEnumToSymbol } from "./currencyEnum";

describe('currencyEnumToSymbol', () => {
    it('returns the correct symbol for the provided enum', () => {
        // Arrange
        const expectedResponse = "€";
        
        // Act
        const result = currencyEnumToSymbol(CurrencyEnum.EUR);

        // Assert
        expect(result).toEqual(expectedResponse);
    });
});