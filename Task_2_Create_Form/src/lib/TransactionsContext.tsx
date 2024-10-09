"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: number;
  datetime: string;
  quantity: number;
  pump: string;
  revenue: number;
  unitPrice: number;
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (
    id: number,
    updatedTransaction: Omit<Transaction, "id">
  ) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions phải được sử dụng bên trong TransactionsProvider"
    );
  }
  return context;
};

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      datetime: "2024-10-07T17:25:02",
      quantity: 3.03,
      pump: "1",
      revenue: 60000,
      unitPrice: 19800,
    },
    // Thêm các giao dịch mẫu khác nếu cần
  ]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newId =
      transactions.length > 0
        ? Math.max(...transactions.map((t) => t.id)) + 1
        : 1;
    const newTransaction: Transaction = { id: newId, ...transaction };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTransaction = (
    id: number,
    updatedTransaction: Omit<Transaction, "id">
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { id, ...updatedTransaction } : t))
    );
  };

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction, updateTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
