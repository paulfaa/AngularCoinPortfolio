import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SortModeEnum, sortModeEnumToString } from '../types/sortModeEnum';
import { CurrencyEnum, enumToString } from '../types/currencyEnum';
import { CURRENCY_SELECTED_STORAGE_KEY, SORT_MODE_STORAGE_KEY } from '../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private sortModeSubject = new BehaviorSubject<SortModeEnum>(this.loadSavedSetting(SORT_MODE_STORAGE_KEY, SortModeEnum));
  private currencySelectedSubject = new BehaviorSubject<CurrencyEnum>(this.loadSavedSetting(CURRENCY_SELECTED_STORAGE_KEY, CurrencyEnum));
  private sortMode$: Observable<SortModeEnum> = this.sortModeSubject.asObservable();
  private currency$: Observable<CurrencyEnum> = this.currencySelectedSubject.asObservable();

  public getSelectedSortMode(): Observable<SortModeEnum> {
    return this.sortMode$;
  }

  public getSelectedCurrency(): Observable<CurrencyEnum> {
    return this.currency$;
  }

  public setSelectedSortMode(m: string): void {
    //throw error if not a valid enum value
    const mode = SortModeEnum[m];
    this.sortModeSubject.next(mode);
    localStorage.setItem(SORT_MODE_STORAGE_KEY, sortModeEnumToString(mode)); //make generic method for enum to string
  }

  public setSelectedCurrency(c: string): void {
    const currency = CurrencyEnum[c];
    this.currencySelectedSubject.next(currency);
    localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, enumToString(currency));
  }

  private loadSavedSetting(localStorageKey: string, enumType: any){
    const savedSetting = enumType[localStorage.getItem(localStorageKey)];
    if (savedSetting == null) {
      localStorage.setItem(localStorageKey, enumType[0].toString()); //set saved value to first (default) value for enum
      return CurrencyEnum.EUR;
    }
    else {
      return savedSetting; 
    }
  }
}
