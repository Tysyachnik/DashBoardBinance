export function ema(values: number[], period: number): (number | null)[] {
  const emaRes: (number | null)[] = [];
  const smoothingFactor = 2 / (period + 1);
  let prevEma: number | null = null;

  for (let i = 0; i < values.length; i++) {
    const currVal = values[i];
    if (i === 0) {
      prevEma = currVal;
      emaRes.push(prevEma);
      continue;
    }
    if (prevEma == null) {
      prevEma = currVal;
    } else {
      prevEma = currVal * smoothingFactor + prevEma * (1 - smoothingFactor);
    }
    emaRes.push(prevEma);
  }
  return emaRes.map((val, index) => (index < period - 1 ? null : val));
}
