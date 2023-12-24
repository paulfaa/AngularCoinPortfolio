import { TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CurrencyEnum } from '../types/currencyEnum';
import { SortModeEnum } from '../types/sortModeEnum';
import { CURRENCY_SELECTED_STORAGE_KEY, SORT_MODE_STORAGE_KEY } from '../shared/constants/constants';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(waitForAsync(() => {
    service = new SettingsService();
    localStorage.removeItem(CURRENCY_SELECTED_STORAGE_KEY);
    localStorage.removeItem(SORT_MODE_STORAGE_KEY);
    TestBed.configureTestingModule({
      declarations: [SettingsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  afterEach(() => {
    localStorage.removeItem(CURRENCY_SELECTED_STORAGE_KEY);
    localStorage.removeItem(SORT_MODE_STORAGE_KEY);
  });

  describe('setSelectedCurrency()', () => {
    it('should update the stored value to the provided parameter', () => {
      // Act
      service.setSelectedCurrency("NZD");
      const result = service['currency$'];
      //const result = service['currencySelectedSubject'].getValue();

      //Assert
      expect(result).toEqual(of(CurrencyEnum.EUR));
    });
    it('throws an error if the enum is invalid', () => {
      service.setSelectedCurrency("invalidValue");

      // Assert
    });
  });

  describe('getCurrencySelected()', () => {
    it('should return EUR as default value if no preference saved', () => {
      // Act
      var currency = service.getSelectedCurrency();

      //Assert
      expect(currency).toEqual(of(CurrencyEnum.EUR));
    });
    it('value returned corresponds to value from storage', () => {
      // Arrange
      localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, CurrencyEnum.USD.toString())

      // Act
      const currency = service.getSelectedCurrency();

      // Assert
      expect(currency.toString()).toEqual("USD");
    });
  });

  describe('getSelectedSortMode()', () => {
    it('should return default sort mode if no preference saved', () => {
      // Act
      const mode = service.getSelectedSortMode();

      //Assert
      expect(mode).toEqual(of(SortModeEnum.DEFAULT));
    });
    it('value returned corresponds to value from storage', () => {
      // Arrange
      localStorage.setItem(SORT_MODE_STORAGE_KEY, SortModeEnum.ALPHABETICAL.toString())

      // Act
      const mode = service.getSelectedSortMode();

      // Assert
      expect(mode.toString()).toEqual("ALPHABETICAL");
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
