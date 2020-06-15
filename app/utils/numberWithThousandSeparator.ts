export const numberWithThousandSeparator = (
  number: number,
  decimals: number = 2,
  separator: string = ','
) => {
  number = parseFloat(number.toString());
  return number
    .toFixed(decimals)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
