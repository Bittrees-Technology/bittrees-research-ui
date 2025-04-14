export function convertCertificatesToDenominations(totalShares: number) {
  const denominations = [100, 10, 1];
  const certificateCounts: { [key: number]: number } = {};

  for (const denomination of denominations) {
    certificateCounts[denomination] = Math.floor(totalShares / denomination);
    totalShares %= denomination;
  }

  return certificateCounts;
}
