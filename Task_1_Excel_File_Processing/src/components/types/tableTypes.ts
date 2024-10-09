export interface Transaction {
  date: string;
  time: string;
  amount: number;
}

export interface TransactionTableProps {
  transactions: Transaction[];
}
