export function normalizeWalletTransactionType(transactionType: string): string {
  return transactionType.trim().toLowerCase();
}

const KNOWN_KEYS = new Set([
  "refund",
  "compensation",
  "deduction",
  "deposit",
  "payment",
  "transfer",
  "driver_early_reward",
  "withdrawal",
  "recharge",
  "charge",
  "other",
]);

export function isKnownWalletTransactionTypeKey(key: string): boolean {
  return KNOWN_KEYS.has(key);
}


export function getWalletTransactionTypeLabel(
  transactionType: string,
  t: (key: string) => string,
): string {
  const key = normalizeWalletTransactionType(transactionType);
  if (!isKnownWalletTransactionTypeKey(key)) return transactionType;
  return t(`transactionTypes.${key}`);
}
