"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TransactionFormValues } from "../types";
import { transactionSchema } from "../validationSchema";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTransactions } from "@/lib/TransactionsContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";

const TransactionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<TransactionFormValues>({
    resolver: yupResolver(transactionSchema),
  });
  const { toast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const idParam = searchParams.get("id");

  const [isCreate, setIsCreate] = useState(true);
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedPump, setSelectedPump] = useState<string | undefined>(
    undefined
  );
  const [initialData, setInitialData] = useState<TransactionFormValues | null>(
    null
  );

  const quantity = watch("quantity");
  const unitPrice = watch("unitPrice");
  const datetime = watch("datetime");

  useEffect(() => {
    register("datetime");
    const now = new Date();
    setValue("datetime", now.toISOString());
    setStartDate(now);
  }, [register, setValue]);

  useEffect(() => {
    setIsCreate(mode === "create");
    if (mode === "edit" && idParam) {
      const id = parseInt(idParam, 10);
      const transaction = transactions.find((t) => t.id === id);
      if (transaction) {
        setInitialData({
          datetime: transaction.datetime,
          quantity: transaction.quantity,
          pump: transaction.pump,
          revenue: transaction.revenue,
          unitPrice: transaction.unitPrice,
        });
        setValue("datetime", transaction.datetime);
        setValue("quantity", transaction.quantity);
        setValue("pump", transaction.pump);
        setValue("revenue", transaction.revenue);
        setValue("unitPrice", transaction.unitPrice);
        setSelectedPump(transaction.pump);
      }
    }
  }, [mode, idParam, setValue, transactions]);

  useEffect(() => {
    if (quantity && unitPrice) {
      const revenue = quantity * unitPrice;
      setValue("revenue", revenue);
    } else {
      setValue("revenue", 0);
    }
  }, [quantity, unitPrice, setValue]);

  useEffect(() => {
    if (!selectedPump && mode === "edit" && idParam) {
      const id = parseInt(idParam, 10);
      const transaction = transactions.find((t) => t.id === id);
      if (transaction && transaction.pump) {
        setSelectedPump(transaction.pump);
      }
    }
    if (selectedPump) {
      setValue("pump", selectedPump);
    }
  }, [selectedPump, setValue, idParam, mode, transactions]);

  const onSubmit: SubmitHandler<TransactionFormValues> = (data) => {
    if (!selectedPump) {
      setValue("pump", "");
      toast({
        description: "Vui lòng chọn trụ bơm",
        variant: "destructive",
      });
      return;
    }

    if (isCreate) {
      addTransaction(data);
      toast({
        description: "Giao dịch đã được thêm thành công.",
        variant: "default",
      });
    } else {
      const id = parseInt(idParam || "0", 10);
      updateTransaction(id, data);
      toast({
        description: "Giao dịch đã được cập nhật thành công.",
        variant: "default",
      });
    }
    router.push("/");
  };

  const isFormChanged = (): boolean => {
    if (!initialData) return false;
    const currentData = {
      datetime,
      quantity,
      pump: selectedPump,
      revenue: quantity && unitPrice ? quantity * unitPrice : 0,
      unitPrice,
    };
    return JSON.stringify(initialData) !== JSON.stringify(currentData);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className=" my-10 p-4 max-w-[1100px] mx-auto min-w-[400px]">
      <Button onClick={handleClose} variant={"ghost"} className="mb-4">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>{" "}
        <p className="ml-4 font-semibold text-gray-600 text-lg">Đóng</p>
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl uppercase font-bold mb-4">
            {isCreate ? "Thêm giao dịch" : "Cập nhật giao dịch"}
          </h2>
          {isCreate ? (
            <Button className="font-semibold" type="submit">
              Thêm
            </Button>
          ) : (
            <Button
              className="font-semibold"
              type="submit"
              disabled={!isCreate && !isFormChanged()}
            >
              Cập nhật
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <p>Thời gian</p>
            <DatePicker
              className="bg-white w-full text-black border border-black rounded p-2 mt-1"
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setStartDate(date);
                  setValue("datetime", date.toISOString());
                }
              }}
              showTimeSelect
              timeFormat="HH:mm:ss"
              timeIntervals={1}
              dateFormat="dd/MM/yyyy HH:mm:ss"
              minDate={new Date()}
              placeholderText="Chọn thời gian"
            />
            {errors.datetime && (
              <p className="text-red-500">{errors.datetime.message}</p>
            )}
          </div>
          <div>
            <label>Đơn giá</label>
            <Input
              type="number"
              placeholder="Nhập đơn giá"
              {...register("unitPrice")}
              className="bg-white text-black border border-black rounded p-2 mt-1"
            />
            {errors.unitPrice && (
              <p className="text-red-500">{errors.unitPrice.message}</p>
            )}
          </div>
          <div>
            <label>Số lượng (Lít)</label>
            <Input
              type="number"
              placeholder="Nhập số lượng"
              step="any"
              pattern="[0-9]*[.,]?[0-9]+"
              {...register("quantity")}
              className="bg-white text-black border border-black rounded p-2 mt-1"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label>Trụ</label>
            <Select
              onValueChange={(value) => {
                setValue("pump", value);
                setSelectedPump(value);
              }}
              value={selectedPump}
            >
              <SelectTrigger className="w-full border text-gray-500 border-black">
                <SelectValue placeholder="Chọn Trụ">
                  {selectedPump ? `Trụ ${selectedPump}` : "Chọn Trụ"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Trụ</SelectLabel>
                  <SelectItem value="1">Trụ 1</SelectItem>
                  <SelectItem value="2">Trụ 2</SelectItem>
                  <SelectItem value="3">Trụ 3</SelectItem>
                  <SelectItem value="4">Trụ 4</SelectItem>
                  <SelectItem value="5">Trụ 5</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.pump && (
              <p className="text-red-500">{errors.pump.message}</p>
            )}
          </div>
          <div>
            <label>Doanh Thu (VNĐ)</label>
            <Input
              disabled
              type="number"
              {...register("revenue")}
              className="bg-gray-300 text-gray border border-gray-700 rounded p-2 mt-1"
            />
            {errors.revenue && (
              <p className="text-red-500">{errors.revenue.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
