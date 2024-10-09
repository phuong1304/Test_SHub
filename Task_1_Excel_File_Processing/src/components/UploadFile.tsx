import React, { FC, useState } from "react";
import * as XLSX from "xlsx";
// import { Button } from "./ui/button";
import Image from "next/image";
import { UploadFileProps } from "./types/uploadType";

const UploadFile: FC<UploadFileProps> = ({ onDataExtracted }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra định dạng file
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension !== "xlsx") {
        alert("Vui lòng chỉ chọn file Excel có định dạng .xlsx");
        return;
      }
      setSelectedFile(file.name);
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: "",
            });

            onDataExtracted(jsonData as (string | number)[][]);
          } catch (error) {
            console.error("Lỗi khi đọc file:", error);
            alert(
              "Không thể đọc nội dung file. Đảm bảo file là định dạng Excel .xlsx hợp lệ."
            );
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Lỗi khi tải file:", error);
        alert("Đã xảy ra lỗi khi tải file. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="flex justify-center w-full items-center border border-gray-300 rounded-lg p-6 mt-6 bg-gray-50">
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        {selectedFile ? (
          <>
            <Image
              src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
              width={50}
              height={50}
              alt="Picture of the author"
            />
            {/* <FaFileExcel className="w-12 h-12 text-green-500 mb-2" /> */}
            <span className="text-gray-700 text-lg font-semibold">
              {selectedFile}
            </span>
          </>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <p className="text-gray-500 text-lg font-semibold">
              Tải lên file Excel
            </p>
          </>
        )}
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
      </label>
    </div>
  );
};

export default UploadFile;
