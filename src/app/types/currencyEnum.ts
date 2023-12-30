import { currencyMap } from "../shared/constants/constants";

export enum CurrencyEnum {
    EUR,
    USD,
    AUD,
    NZD
}

export function currencyEnumToSymbol(enumToConvert: CurrencyEnum): string {
  const index = parseInt(enumToConvert.toString());
  const symbol = currencyMap.get(index);
  if(symbol != undefined){
    return symbol;
  }
  else{
    console.error("Failed to lookup currency symbol for " + enumToConvert);
  }
}

export function currencyEnumToCurrencyCode(enumToConvert: CurrencyEnum): string {
  const index = parseInt(enumToConvert.toString());
  switch(index){
    case CurrencyEnum.EUR:
      return "EUR";
    case CurrencyEnum.USD:
      return "USD";
    case CurrencyEnum.AUD:
      return "AUD";
    case CurrencyEnum.NZD:
      return "NZD";
    default:
      console.error("failed to convert ", enumToConvert);
      return "EUR";
  }
}