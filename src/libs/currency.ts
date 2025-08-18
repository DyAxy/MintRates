export class CurrencyUtil {
  private rateData: CurrencyRate;

  constructor(rateData: CurrencyRate) {
    this.rateData = rateData;
  }

  public changeRateData(rateData: CurrencyRate) {
    this.rateData = rateData;
  }

  public getTargetRate({
    from,
    to,
    value = 100,
  }: {
    from: string;
    to: string;
    value?: number;
  }): number {
    const fromRate = this.rateData[from];
    const toRate = this.rateData[to];
    if (!fromRate || !toRate) return 0;
    return (value * toRate) / fromRate || 0;
  }
  public refreshNumbers({
    currencies,
    baseIndex,
    baseValue = 100,
  }: {
    currencies: string[];
    baseIndex: number;
    baseValue?: number;
  }): number[] {
    return currencies.map((item) =>
      parseFloat(
        this.getTargetRate({
          from: currencies[baseIndex],
          to: item,
          value: baseValue,
        }).toFixed(4)
      )
    );
  }
}
