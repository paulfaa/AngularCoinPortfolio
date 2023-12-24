export class CryptoName {
  displayName: string;
  longName: string;
  ticker: string;
  coinMarketId: number;

  constructor(displayName: string, ticker: string, coinMarketId: number) {
    this.displayName = displayName;
    this.ticker = ticker;
    this.coinMarketId = coinMarketId;
    this.longName = this.displayName + " (" + this.ticker + ")";
  }
}