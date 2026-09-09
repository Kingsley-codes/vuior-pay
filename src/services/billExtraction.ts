"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/services/firebase";

export type ExtractedBillFields = {
  name?: string;
  amount?: string;
  accountNumber?: string;
  dueDate?: string;
};

function fileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export async function extractBillFromImage(file: File) {
  const imageDataUrl = await fileAsDataUrl(file);
  const extractBill = httpsCallable<
    { imageDataUrl: string },
    ExtractedBillFields
  >(functions, "extractBill", { timeout: 60_000 });
  const result = await extractBill({ imageDataUrl });
  return result.data;
}
