// TODO(App Check): Restore this import when Firebase App Check is configured.
// import { getAppCheckToken } from "@/services/firebase";

export async function appCheckFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  // TODO(App Check): Restore this header when backend enforcement is enabled.
  // headers.set("X-Firebase-AppCheck", await getAppCheckToken());
  return fetch(input, { ...init, headers });
}
