"use client";

type UploadDropzoneProps = {
  fileName: string;
  error: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UploadDropzone({
  fileName,
  error,
  onFileChange,
}: UploadDropzoneProps) {
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-600 hover:bg-blue-50">
        <span className="text-4xl">📎</span>

        <span className="mt-3 text-sm font-black text-[#06183A]">
          Choose file or drag here
        </span>

        <span className="mt-1 text-xs font-bold text-slate-400">
          PDF, JPG or PNG · max 10 MB
        </span>

        <input
          type="file"
          name="file"
          accept="application/pdf,image/jpeg,image/png"
          required
          onChange={onFileChange}
          className="hidden"
        />
      </label>

      {fileName && (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
          Selected file: {fileName}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}