import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyEnum } from 'src/app/currencyEnum';

@Pipe({
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value === CurrencyEnum.EUR) {
      return 'EUR';
    } else if (value === CurrencyEnum.USD) {
      return 'USD';
    } else if (value === CurrencyEnum.NZD) {
      return 'NZD';
    } else {
      return '';
    }
  }
}