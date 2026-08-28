import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { normalizeInternationalPhone } from "@/utils/inputFormatting";

export type Provider = {
  id: string;
  providerId?: string;
  name: string;
  searchName: string;
  phoneNumbers: string[];
  categories: string[];
};

export function normalizeProviderName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function strings(value: unknown) {
  return (Array.isArray(value) ? value : [value])
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]) {
  return Array.from(new Map(values.map((value) => [value.toLocaleLowerCase(), value])).values());
}

function toProvider(id: string, data: Record<string, unknown>): Provider | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const status = typeof data.status === "string" ? data.status.toLowerCase() : "active";
  if (!name || !["active", "approved", "verified"].includes(status)) return null;
  return {
    id,
    providerId: typeof data.provider_ID === "string" ? data.provider_ID : undefined,
    name,
    searchName: normalizeProviderName(typeof data.searchName === "string" ? data.searchName : name),
    phoneNumbers: unique(strings(data.phoneNumber).map(normalizeInternationalPhone).filter(Boolean)),
    categories: unique(strings(data.category)),
  };
}

export async function searchProviders(term: string): Promise<Provider[]> {
  const searchName = normalizeProviderName(term);
  if (!searchName) return [];
  const snapshot = await getDocs(query(
    collection(db, "providers"), orderBy("searchName"), startAt(searchName), endAt(`${searchName}\uf8ff`), limit(8),
  ));
  return snapshot.docs.map((item) => toProvider(item.id, item.data())).filter((item): item is Provider => item !== null);
}

function providerPublicId() {
  return `VPP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function storeProvider(
  name: string,
  phoneNumber?: string,
  category?: string,
  selectedProviderId?: string,
) {
  const displayName = name.trim().replace(/\s+/g, " ");
  const searchName = normalizeProviderName(displayName);
  if (!searchName) throw new Error("A provider name is required.");
  const phone = normalizeInternationalPhone(phoneNumber || "");
  const categoryName = category?.trim() || "";

  const merge = async (providerRef: ReturnType<typeof doc>) => runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(providerRef);
    if (!snapshot.exists()) throw new Error("The selected provider no longer exists.");
    const data = snapshot.data();
    const providerId = typeof data.provider_ID === "string" && data.provider_ID.trim() ? data.provider_ID : providerPublicId();
    transaction.set(providerRef, {
      provider_ID: providerId,
      phoneNumber: unique([...strings(data.phoneNumber).map(normalizeInternationalPhone).filter(Boolean), ...(phone ? [phone] : [])]),
      category: unique([...strings(data.category), ...(categoryName ? [categoryName] : [])]),
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return providerId;
  });

  if (selectedProviderId) {
    const selected = doc(db, "providers", selectedProviderId);
    const snapshot = await getDoc(selected);
    if (snapshot.exists() && normalizeProviderName(String(snapshot.data().name || "")) === searchName) return merge(selected);
  }
  const existing = await getDocs(query(collection(db, "providers"), where("searchName", "==", searchName), limit(1)));
  if (existing.docs[0]) return merge(existing.docs[0].ref);

  const providerRef = doc(collection(db, "providers"));
  const providerId = providerPublicId();
  await setDoc(providerRef, {
    provider_ID: providerId, name: displayName, searchName,
    phoneNumber: phone ? [phone] : [], category: categoryName ? [categoryName] : [],
    status: "active", createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  });
  return providerId;
}
