"use client";

import React, { FC } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table"; // Đảm bảo đường dẫn đúng

interface Transaction {
  date: string;
  time: string;
  amount: number;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: FC<TransactionTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-500">
        Không có giao dịch nào để hiển thị.
      </div>
    );
  }

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="mt-6 min-w-[400px] max-w-[600px]">
      <div className="relative max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg">
        {" "}
        {/* Thiết lập chiều cao cố định và cuộn dọc */}
        <Table className="min-w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Giờ</TableHead>
              <TableHead>Thành tiền (VNĐ)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.time}</TableCell>
                <TableCell>{transaction.amount.toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right font-semibold" colSpan={3}>
                Tổng:
              </TableCell>
              <TableCell className="font-semibold">
                {totalAmount.toLocaleString()} VND
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
