import { ValueService } from "../service/value.service";

export function initializeAppFactory(valueService: ValueService) {
    return () => valueService.updateAllExchangeRates();
}