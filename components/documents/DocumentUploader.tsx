"use client";

import { useState } from "react";
import UploadDropzone from "./UploadDropzone";

type DocumentUploaderProps = {
  type: string;
  title: string;
  description: string;
  loanApplicationId?: string | null;
};

export default function DocumentUploader({
  type,
  title,
  description,
  loanApplicationId,
}: DocumentUploaderProps) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");

    const file = e.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPG and PNG files are allowed.");
      setFileName("");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      setFileName("");
      return;
    }

    setFileName(file.name);
  }

  return (
    <form
      action="/api/documents/upload"
      method="POST"
      encType="multipart/form-data"
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="type" value={type} />

      {loanApplicationId && (
        <input type="hidden" name="loanApplicationId" value={loanApplicationId} />
      )}

      <div>
        <h3 className="text-lg font-black text-[#06183A]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <div className="mt-5">
        <UploadDropzone
          fileName={fileName}
          error={error}
          onFileChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        disabled={!!error}
        className="mt-5 w-full rounded-2xl bg-[#062B8C] py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-50"
      >
        Upload document
      </button>
    </form>
  );
}