"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/services/firebase";
// TODO(App Check): Restore getAppCheckToken when backend enforcement is enabled.
// import { functions, getAppCheckToken } from "@/services/firebase";

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
    reader.onerror = () => reject(new Error("Unable to read the selected document."));
    reader.readAsDataURL(file);
  });
}

export async function extractBillFromImage(file: File) {
  const imageDataUrl = await fileAsDataUrl(file);
  // TODO(App Check): Restore this preflight token request when App Check is enabled.
  // await getAppCheckToken();
  const extractBill = httpsCallable<
    { imageDataUrl: string; fileName: string },
    ExtractedBillFields
  >(functions, "extractBill", { timeout: 120_000 });
  const result = await extractBill({ imageDataUrl, fileName: file.name });
  return result.data;
}
