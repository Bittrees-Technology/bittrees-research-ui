type CertificateCounts = {
  [key: number]: number;
};

export function convertCertificatesToDenominations(
  totalShares: number
): CertificateCounts {
  const denominations = [100, 10, 1];
  const certificateCounts: { [key: number]: number } = {};

  for (const denomination of denominations) {
    certificateCounts[denomination] = Math.floor(totalShares / denomination);
    totalShares %= denomination;
  }

  return certificateCounts;
}

export function denominationsToMintBatch(denominations: CertificateCounts): {
  tokenIds: bigint[];
  amounts: bigint[];
} {
  const tokenIds: bigint[] = [];
  const amounts: bigint[] = [];

  for (const [key, value] of Object.entries(denominations)) {
    if (value > 0) {
      tokenIds.push(BigInt(key));
      amounts.push(BigInt(value));
    }
  }

  return { tokenIds, amounts };
}
