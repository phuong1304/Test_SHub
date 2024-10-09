"use client";
import React from "react";
import { useForm } from "react-hook-form";

const MinimalForm: React.FC = () => {
  const { register, handleSubmit } = useForm<{ test: string }>();

  const onSubmit = (data: { test: string }) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("test")} placeholder="Test input" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MinimalForm;
