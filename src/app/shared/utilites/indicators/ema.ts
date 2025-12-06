export function ema(values: number[], period: number): (number | null)[] {
  const res: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEma: number | null = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (i === 0) {
      prevEma = v;
      res.push(prevEma);
      continue;
    }
    if (prevEma == null) {
      prevEma = v;
    } else {
      prevEma = v * k + (1 - k);
    }
    res.push(prevEma);
  }
  return res.map((val, index) => (index < period - 1 ? null : val));
}
