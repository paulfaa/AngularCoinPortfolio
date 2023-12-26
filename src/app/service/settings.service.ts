import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SortModeEnum, sortModeEnumToString } from '../types/sortModeEnum';
import { CURRENCY_SELECTED_STORAGE_KEY, SORT_MODE_STORAGE_KEY, currencies } from '../shared/constants/constants';
import { Currency } from '../types/currency.type';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private sortModeSubject = new BehaviorSubject<SortModeEnum>(this.loadSavedSortType());
  private currencySelectedSubject = new BehaviorSubject<Currency>(this.loadSavedCurrency());
  private sortMode$: Observable<SortModeEnum> = this.sortModeSubject.asObservable();
  private currency$: Observable<Currency> = this.currencySelectedSubject.asObservable();

  public getSelectedSortMode(): Observable<SortModeEnum> {
    return this.sortMode$;
  }

  public getSelectedCurrency(): Observable<Currency> {
    return this.currency$;
  }

  public setSelectedSortMode(m: string): void {
    //throw error if not a valid enum value
    const mode = SortModeEnum[m];
    this.sortModeSubject.next(mode);
    localStorage.setItem(SORT_MODE_STORAGE_KEY, sortModeEnumToString(mode)); //make generic method for enum to string
  }

  public setSelectedCurrency(currency: Currency): void {
    this.currencySelectedSubject.next(currency);
    localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, currency.code);
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

  private loadSavedCurrency(): Currency {
    const savedCurrencyCode = localStorage.getItem(CURRENCY_SELECTED_STORAGE_KEY);
    if (savedCurrencyCode == null || savedCurrencyCode == "undefined") {
      localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, "EUR");
      return currencies[0];
    }
    else {
      return currencies.find(currency => currency.code == savedCurrencyCode);
    }
  }
}
