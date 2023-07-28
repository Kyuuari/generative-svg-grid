function random(
  minOrArray: number | any[],
  max?: number,
  clamp?: boolean
): number | any {
  const isArray = Array.isArray(minOrArray);

  if (isArray) {
    const targetArray = minOrArray as any[];
    return targetArray[random(0, targetArray.length - 1, true)] as any;
  } else {
    const min = minOrArray as number;
    max = max || 1;
    clamp = clamp || false;

    const val = Math.random() * (max - min) + min;

    return clamp ? Math.round(val) : val;
  }
}

export { random };
