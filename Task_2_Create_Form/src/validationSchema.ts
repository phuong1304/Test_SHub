import * as yup from "yup";

export const transactionSchema = yup.object().shape({
  datetime: yup.string().required("Vui lòng chọn thời gian"),
  quantity: yup
    .number()
    .typeError("Số lượng phải là một số dương") // Kiểm tra để đảm bảo người dùng nhập số
    .required("Vui lòng nhập số lượng")
    .positive("Số lượng phải là một số dương"), // Cho phép cả số nguyên và số thập phân
  pump: yup.string().required("Vui lòng chọn trụ bơm"),
  revenue: yup
    .number()
    .required("Vui lòng nhập doanh thu")
    .positive("Doanh thu phải là một số dương"),
  unitPrice: yup
    .number()
    .typeError("Đơn giá phải là một số dương") // Kiểm tra để đảm bảo người dùng nhập số
    .required("Vui lòng nhập đơn giá")
    .positive("Đơn giá phải là một số dương"),
});
