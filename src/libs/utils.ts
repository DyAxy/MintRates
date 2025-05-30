export const getTargetRate = ({
  rateData,
  from,
  to,
  value,
  fixed,
}: {
  rateData: CurrencyRate;
  from: string;
  to: string;
  value?: number;
  fixed?: number;
}) => {
  const fromRate = rateData[from];
  const toRate = rateData[to];
  if (!fromRate || !toRate) return "0.0000";
  return (((value ?? 100) * toRate) / fromRate).toFixed(fixed ?? 4);
};
