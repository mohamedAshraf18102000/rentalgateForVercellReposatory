export type WalletInfo = {
  walletId: number;
  ownerType: string;
  ownerId: number;
  ownerName: string;
  balance: number;
};

// Wallet transactions
export type Transaction = {
  transactionId: number;
  transactionType: string;
  amount: number;
  balanceAfter: number;
  description: string;
  reservationId: number;
  createdBy: number;
  createdAt: string;
};

export type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  sort: Sort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
};

export type TransactionsResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Transaction[];
  number: number;
  sort: Sort;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};
