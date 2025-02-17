export function AOToUSD(AOBalance: number) {
  const AO_PRICE = 33.92;

  return AOBalance * AO_PRICE;
}
