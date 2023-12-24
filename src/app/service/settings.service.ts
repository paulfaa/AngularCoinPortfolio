import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SortModeEnum, sortModeEnumToString } from '../types/sortModeEnum';
import { CurrencyEnum, enumToString } from '../types/currencyEnum';
import { CURRENCY_SELECTED_STORAGE_KEY, SORT_MODE_STORAGE_KEY } from '../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private sortModeSubject = new BehaviorSubject<SortModeEnum>(this.loadSavedSortType());
  private currencySelectedSubject = new BehaviorSubject<CurrencyEnum>(this.loadSavedCurrency());
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

  private loadSavedSortType() {
    const savedSetting = localStorage.getItem(SORT_MODE_STORAGE_KEY);
    if (savedSetting == null || savedSetting == "undefined") {
      localStorage.setItem(SORT_MODE_STORAGE_KEY, SortModeEnum[0]);
      return SortModeEnum[0];
    }
    else {
      return SortModeEnum[savedSetting]; 
    }
  }

  private loadSavedCurrency() {
    const savedSetting = localStorage.getItem(CURRENCY_SELECTED_STORAGE_KEY);
    if (savedSetting == null || savedSetting == "undefined") {
      localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, CurrencyEnum.EUR);
      return CurrencyEnum.EUR;
    }
    else {
      return CurrencyEnum[savedSetting as keyof typeof CurrencyEnum];
    }
  }
}
