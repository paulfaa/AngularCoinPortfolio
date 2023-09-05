export enum CurrencyEnum {
    EUR,
    USD,
    NZD
}

export function enumToString(enumValue: CurrencyEnum): string {
    switch (enumValue) {
      case CurrencyEnum.EUR:
        return 'EUR';
      case CurrencyEnum.USD:
        return 'USD';
      case CurrencyEnum.NZD:
        return 'NZD';
      default:
        return 'Unknown';
    }
  }