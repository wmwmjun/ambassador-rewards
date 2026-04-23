export type Status = 'completed' | 'pending' | 'rejected';
export type TransactionType = 'egift' | 'award' | 'bank';

export interface Transaction {
  id: number;
  type: TransactionType;
  title: string;
  date: string;
  pts: number;
  status: Status;
  code?: string;
}

export interface EGift {
  id: string;
  name: string;
  label: string;
  cat: string;
  range: string;
  bg: string;
  fg: string;
  values: number[];
  terms: string;
}

export interface BankAccount {
  name: string;
  bankName: string;
  account: string;
  ifsc: string;
}
