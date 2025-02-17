export function getAOProjection(arweaveBalance: number) {
  const AO_PER_30_DAYS = 0.001266;

  return arweaveBalance * AO_PER_30_DAYS;
}
