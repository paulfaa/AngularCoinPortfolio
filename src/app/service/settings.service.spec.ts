import { TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
    it('should update the stored value to the provided parameter', (done: DoneFn) => {
      // Act
      service.setSelectedCurrency(CurrencyEnum.NZD);
      const currency = service['currency$'];
      //const result = service['currencySelectedSubject'].getValue();

      //Assert
      currency.subscribe((result) => {
        expect(result).toBe(CurrencyEnum.NZD);
        done();
      });
    });
  });

  describe('getCurrencySelected()', () => {
    it('should return EUR as default value if no preference saved', (done: DoneFn) => {
      // Act
      const currency = service.getSelectedCurrency();

      // Assert
      currency.subscribe((result) => {
        expect(result).toBe(CurrencyEnum.EUR);
        done();
      });
    });
    it('value returned corresponds to value from storage', (done: DoneFn) => {
      // Arrange
      localStorage.setItem(CURRENCY_SELECTED_STORAGE_KEY, "1")

      // Act
      const currency = service.getSelectedCurrency();

      // Assert
      currency.subscribe((result) => {
        expect(result).toBe(CurrencyEnum.USD);
        done();
      });
    });
  });

  describe('getSelectedSortMode()', () => {
    it('should return default sort mode if no preference saved', (done: DoneFn) => {
      // Act
      const mode = service.getSelectedSortMode();

      //Assert
      mode.subscribe((result) => {
        expect(result.toString()).toBe('DEFAULT');
        done();
      });
    });
    it('value returned corresponds to value from storage', (done: DoneFn) => {
      // Arrange
      localStorage.setItem(SORT_MODE_STORAGE_KEY, SortModeEnum.ALPHABETICAL.toString())

      // Assert
      service.getSelectedSortMode().subscribe((value) => {
        expect(value.toString()).toBe('ALPHABETICAL');
        done();
      });
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
