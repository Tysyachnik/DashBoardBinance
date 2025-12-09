export function sma(values: number[], period: number): (number | null)[] {
  const res: (number | null)[] = [];
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) {
      sum -= values[i - period];
    }
    if (i >= period - 1) {
      res.push(sum / period);
    } else {
      res.push(null);
    }
  }
  return res;
}
