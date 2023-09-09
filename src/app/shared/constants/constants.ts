import { CryptoName } from "src/app/types/cryptoName.type";

export const cryptoNames: CryptoName[] = [
    new CryptoName("Bitcoin","BTC", 1),
    new CryptoName("Cardano","ADA", 12),
    new CryptoName("Litecoin","LTE", 25),
    new CryptoName("Ethereum","ETH", 59),
    new CryptoName("Polkadot","DOT", 61),
    new CryptoName("Stella","XLM", 456),
    new CryptoName("Tether","USDT", 458),
    new CryptoName("XRP","XRP", 742),
    new CryptoName("Solana","SOL", 797)
  ]

  export const twelveHoursInMs: number = 43200000;

  /* export const cryptoNames: CryptoName[] = [
    { displayName: "Bitcoin", ticker: "BTC" },
    { displayName: "Cardano", ticker: "ADA" },
    { displayName: "Litecoin", ticker: "LTC" },
    { displayName: "Ethereum", ticker: "ETH" },
    { displayName: "Polkadot", ticker: "DOT" },
    { displayName: "Stellar", ticker: "XLM" },
    { displayName: "Tether", ticker: "USDT" },
    { displayName: "XRP", ticker: "XRP" },
    { displayName: "Solana", ticker: "SOL" }
]; */