"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import moment from "moment";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IFormInputs } from "./types/formTypes";

interface FormTransactionProps {
  uniqueDates: string[];
  onFormSubmit: (values: IFormInputs, selectedDate: string) => void;
}

const schema = yup.object().shape({
  startTime: yup.string().required("Bắt buộc chọn giờ bắt đầu"),
  endTime: yup.string().required("Bắt buộc chọn giờ kết thúc"),
});

const FormTransaction: React.FC<FormTransactionProps> = ({
  uniqueDates,
  onFormSubmit,
}) => {
  const methods = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const { reset } = methods;

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");

  // Reset form and internal states when uniqueDates changes (i.e., new file is uploaded)
  useEffect(() => {
    reset();
    setSelectedDate("");
    setStartTime("");
  }, [uniqueDates, reset]);

  const handleSubmit: SubmitHandler<IFormInputs> = (values) => {
    const dateToUse = uniqueDates.length === 1 ? uniqueDates[0] : selectedDate;

    if (!dateToUse) {
      alert("Vui lòng chọn ngày!");
      return;
    }

    onFormSubmit(values, dateToUse);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-4 mt-4"
      >
        {uniqueDates.length === 1 ? (
          <h2 className="mb-4 text-lg font-semibold text-gray-600">
            Trong file là doanh số trong ngày: {uniqueDates[0]}
          </h2>
        ) : (
          <div className="mb-4">
            <h2 className=" mb-4 text-lg font-semibold text-gray-600">
              Trong file là doanh số trong ngày: {uniqueDates.join(", ")}
            </h2>
            <div className="flex items-center gap-2">
              <label
                htmlFor="date-select"
                className="block text-lg font-semibold"
              >
                Chọn ngày:
              </label>
              <Select onValueChange={setSelectedDate} value={selectedDate}>
                <SelectTrigger className="w-1/3 text-base text-gray-500">
                  <SelectValue placeholder="Chọn ngày" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Controller
          name="startTime"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-lg">
                Giờ bắt đầu:
              </FormLabel>
              <FormControl>
                <input
                  type="time"
                  {...field}
                  className="bg-white text-black border border-black rounded p-2 ml-4 mt-1"
                  onChange={(e) => {
                    field.onChange(e);
                    setStartTime(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="endTime"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-lg">
                Giờ kết thúc
              </FormLabel>
              <FormControl>
                <input
                  type="time"
                  {...field}
                  className="bg-white text-black border border-black rounded p-2 ml-4 mt-1"
                  min={startTime}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          className="font-semibold uppercase"
        >
          Truy vấn
        </Button>
      </form>
    </FormProvider>
  );
};

export default FormTransaction;
