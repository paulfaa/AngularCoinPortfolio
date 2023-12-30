import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SortModeEnum, sortModeEnumToString } from '../types/sortModeEnum';
import { CURRENCY_SELECTED_STORAGE_KEY, SORT_MODE_STORAGE_KEY } from '../shared/constants/constants';
import { CurrencyEnum } from '../types/currencyEnum';

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
    const mode = SortModeEnum[m];
    this.sortModeSubject.next(mode);
    localStorage.setItem(SORT_MODE_STORAGE_KEY, sortModeEnumToString(mode)); //refactor to be like setSelectedCurrency
  }

  public setSelectedCurrency(currency: CurrencyEnum): void {
    try {
      const indexString = currency.toString();
      this.currencySelectedSubject.next(currency);
      localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, indexString);
    }
    catch (error) {
      console.error("Error setting currency to ", CurrencyEnum[currency])
    }
  }

  private loadSavedSortType() {
    const savedSortType = localStorage.getItem(SORT_MODE_STORAGE_KEY);
    if (savedSortType == null || savedSortType == "undefined") {
      localStorage.setItem(SORT_MODE_STORAGE_KEY, SortModeEnum[0]);
      return SortModeEnum[0];
    }
    else {
      return SortModeEnum[savedSortType];
    }
  }

  private loadSavedCurrency(): CurrencyEnum {
    const savedCurrency = parseInt(localStorage.getItem(CURRENCY_SELECTED_STORAGE_KEY));
    if (savedCurrency == null) {
      localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, CurrencyEnum[0]);
      return CurrencyEnum.EUR;
    }
    else {
      return savedCurrency as CurrencyEnum
    }
  }
}
