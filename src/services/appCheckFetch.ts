import { getAppCheckToken } from "@/services/firebase";

export async function appCheckFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("X-Firebase-AppCheck", await getAppCheckToken());
  return fetch(input, { ...init, headers });
}
