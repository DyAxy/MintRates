interface CurrencyRate {
  [key: string]: number;
}
interface CurrencyList {
  [key: string]: {
    icon: string;
    displayName: string;
    symbol: string;
  };
}
interface RateItem {
  id: string;
  name: string;
}
