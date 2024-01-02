import { ValueService } from "../service/value.service";

export function initializeAppFactory(valueService: ValueService) {
    return () => console.log("initializing app");
    //return () => valueService.updateAllExchangeRates();
}