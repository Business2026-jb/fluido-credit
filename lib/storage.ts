import { DOCUMENTS_BUCKET, supabaseAdmin } from "./supabase";

export const allowedDocumentMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export const maxDocumentSize = 10 * 1024 * 1024;

export function getDocumentFolder(type: string) {
  const clean = type.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return clean || "other";
}

export async function uploadDocumentToStorage({
  file,
  userId,
  type,
}: {
  file: File;
  userId: string;
  type: string;
}) {
  if (!allowedDocumentMimeTypes.includes(file.type)) {
    throw new Error("Only PDF, JPG and PNG files are allowed.");
  }

  if (file.size > maxDocumentSize) {
    throw new Error("File size must be less than 10 MB.");
  }

  const folder = getDocumentFolder(type);
  const extension = file.name.split(".").pop() || "file";
  const filePath = `${userId}/${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from(DOCUMENTS_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
  console.error("SUPABASE STORAGE ERROR:", error);
  throw new Error(JSON.stringify(error));
}

  return {
    filePath,
    fileName: file.name,
    fileUrl: filePath,
    mimeType: file.type,
    size: file.size,
  };
}