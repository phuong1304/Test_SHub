"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useTransactions } from "@/lib/TransactionsContext";

const TransactionsPage: React.FC = () => {
  const router = useRouter();
  const { transactions } = useTransactions();

  const tableHeaders = [
    { label: "STT", width: "w-16", textAlign: "text-center" },
    { label: "Thời gian", width: "w-48", textAlign: "text-left" },
    { label: "Số lượng (Lít)", width: "w-24", textAlign: "text-right" },
    { label: "Trụ", width: "w-16", textAlign: "text-center" },
    { label: "Doanh thu (VNĐ)", width: "w-32", textAlign: "text-left" },
    { label: "Đơn giá (VNĐ)", width: "w-32", textAlign: "text-right" },
    { label: "Sửa", width: "w-16", textAlign: "text-center" },
  ];

  const handleCreate = () => {
    router.push("/transaction-form?mode=create");
  };

  const handleEdit = (id: number) => {
    router.push(`/transaction-form?mode=edit&id=${id}`);
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(value));
  };

  // Tính tổng doanh thu
  const totalRevenue = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => acc + transaction.revenue,
      0
    );
  }, [transactions]);

  return (
    <div className="py-4 px-6 max-w-[1200px] min-w-[1000px] mx-auto my-10">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold uppercase mb-4">
          Giao dịch bán xăng
        </h1>
        <Button onClick={handleCreate} className="mb-4 font-semibold">
          + Thêm giao dịch
        </Button>
      </div>
      <div className="overflow-x-auto min-w-[700px]">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className={`${header.width} ${header.textAlign} font-semibold`}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={transaction.id} className="hover:bg-gray-100">
                <TableCell className="w-16 text-center">{index + 1}</TableCell>
                <TableCell className="w-48 text-left">
                  {formatDateTime(transaction.datetime)}
                </TableCell>
                <TableCell className="w-24 text-right">
                  {transaction.quantity}
                </TableCell>
                <TableCell className="w-16 text-center">
                  Trụ {transaction.pump}
                </TableCell>
                <TableCell className="w-32 text-right">
                  {formatCurrency(transaction.revenue)}
                </TableCell>
                <TableCell className="w-32 text-right">
                  {formatCurrency(transaction.unitPrice)}
                </TableCell>
                <TableCell className="w-16 text-center">
                  <Button
                    onClick={() => handleEdit(transaction.id)}
                    variant="default"
                    className="p-2"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {/* Tổng thành tiền từ Doanh Thu */}
            <TableRow className="bg-gray-200 font-bold">
              <TableCell className="w-16 text-center"></TableCell>
              <TableCell className="w-48 text-left">
                Tổng doanh thu (VNĐ)
              </TableCell>
              <TableCell className="w-24 text-right"></TableCell>
              <TableCell className="w-16 text-center"></TableCell>
              <TableCell className="w-32 text-right">
                {formatCurrency(totalRevenue)}
              </TableCell>
              <TableCell className="w-32 text-right"></TableCell>
              <TableCell className="w-16 text-center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsPage;
