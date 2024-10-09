"use client";

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import UploadFile from "@/components/UploadFile";

import TransactionTable from "@/components/TransactionTable";
import CustomTooltip from "@/components/Tooltip";
import FormTransaction from "@/components/TransactionForm";

interface IFormInputs {
  startTime: string;
  endTime: string;
}

interface Transaction {
  date: string;
  time: string;
  amount: number;
}

const schema = yup.object().shape({
  startTime: yup.string().required("Bắt buộc chọn giờ bắt đầu"),
  endTime: yup.string().required("Bắt buộc chọn giờ kết thúc"),
});

export default function Home() {
  const methods = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const [data, setData] = useState<Transaction[]>([]);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]); // State mới

  const handleDataExtracted = (
    extractedData: (string | number | undefined)[][]
  ) => {
    const startRowIndex = extractedData.findIndex((row) => {
      return (
        row.includes("Ngày") &&
        row.includes("Giờ") &&
        row.includes("Thành tiền (VNĐ)")
      );
    });

    if (startRowIndex === -1) {
      alert(
        "Kiểm tra lại file của bạn, có thể nó đã sai định dạng file mẫu cho phép"
      );
      return;
    }

    const headers = extractedData[startRowIndex] as string[];
    const timeIndex = headers.indexOf("Giờ");
    const amountIndex = headers.indexOf("Thành tiền (VNĐ)");

    const dateIndex = headers.indexOf("Ngày");
    // Lấy ngày đầu tiên từ cột "Ngày" sau hàng tiêu đề
    const transactions = extractedData
      .slice(startRowIndex + 1)
      .map((row) => {
        const dateStr =
          typeof row[dateIndex] === "string" ? row[dateIndex].trim() : "";
        const timeValue = row[timeIndex];
        let timeStr = "";
        let amount = 0;

        // Chuyển đổi thời gian nếu là số thập phân
        if (typeof timeValue === "number") {
          const totalMinutes = timeValue * 24 * 60;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = Math.floor(totalMinutes % 60);
          const seconds = Math.round((totalMinutes * 60) % 60);
          timeStr = moment({
            hour: hours,
            minute: minutes,
            second: seconds,
          }).format("HH:mm:ss");
        } else if (typeof timeValue === "string") {
          timeStr = timeValue.trim();
        }

        if (typeof row[amountIndex] === "number") {
          amount = row[amountIndex];
        } else if (typeof row[amountIndex] === "string") {
          amount = parseFloat(row[amountIndex].replace(/,/g, ""));
        }

        if (dateStr && timeStr && !isNaN(amount)) {
          return { date: dateStr, time: timeStr, amount };
        }
        return null;
      })
      .filter(Boolean);

    const dates = Array.from(
      new Set(transactions.map((item) => item?.date))
    ).filter((date): date is string => date !== undefined);
    setUniqueDates(dates);
    setData(transactions as Transaction[]);

    // Reset các state khác khi tải lên file mới
    setFilteredTransactions([]);
    setTotalAmount(null);
    methods.reset(); // Reset các trường trong form
  };

  const handleFormSubmit = useCallback(
    (values: { startTime: string; endTime: string }, selectedDate: string) => {
      const start = moment(
        `${selectedDate} ${values.startTime}`,
        "DD/MM/YYYY HH:mm"
      );
      const end = moment(
        `${selectedDate} ${values.endTime}`,
        "DD/MM/YYYY HH:mm"
      );

      if (!start.isValid() || !end.isValid()) {
        alert("Thời gian không hợp lệ!");
        return;
      }

      const filteredData = data.filter((item) => {
        const dateTimeStr = `${item.date} ${item.time}`;
        const dateTime = moment(dateTimeStr, [
          "DD/MM/YYYY HH:mm:ss",
          "DD/MM/YYYY hh:mm:ss A",
        ]);
        return dateTime.isBetween(start, end, undefined, "[)");
      });

      // Sắp xếp các giao dịch đã lọc theo giờ từ sớm tới muộn
      const sortedFilteredData = filteredData.sort((a, b) => {
        const timeA = moment(a.time, "HH:mm:ss");
        const timeB = moment(b.time, "HH:mm:ss");
        if (timeA.isBefore(timeB)) return -1;
        if (timeA.isAfter(timeB)) return 1;
        return 0;
      });

      const total = sortedFilteredData.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      setTotalAmount(total);
      setFilteredTransactions(sortedFilteredData);
    },
    [data]
  );

  return (
    <div className="p-6  max-w-[1200px] mx-auto">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-bold ">Data Report</h1>
        <CustomTooltip content="Tải lên file Excel chứa dữ liệu các trường: Ngày, Giờ, Thành tiền (VNĐ) để xem báo cáo">
          <button className="IconButton">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </CustomTooltip>
      </div>
      <UploadFile onDataExtracted={handleDataExtracted} />
      <div className="flex flex-wrap justify-between">
        <div className="w-[500px]">
          {uniqueDates.length > 0 && (
            <FormTransaction
              uniqueDates={uniqueDates}
              onFormSubmit={handleFormSubmit}
            />
          )}

          {totalAmount !== null && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Tổng Thành Tiền: {totalAmount.toLocaleString()} VND
              </h2>
            </div>
          )}
        </div>
        <div className="w-[500px] ">
          {/* Hiển thị bảng giao dịch đã lọc */}
          {filteredTransactions.length > 0 && (
            <TransactionTable transactions={filteredTransactions} />
          )}
        </div>
      </div>
    </div>
  );
}
