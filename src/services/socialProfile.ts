import { beforeAuthStateChanged, type Auth, type User } from "firebase/auth";

type SocialProfile = { isNewUser: boolean; mustChangePassword: boolean };
const requests = new WeakMap<User, Promise<SocialProfile>>();

export function completeSocialProfile(user: User): Promise<SocialProfile> {
  const existing = requests.get(user);
  if (existing) return existing;
  const request = (async () => {
    const project = process.env.NEXT_PUBLIC_PROJECT_ID;
    const region = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || "us-central1";
    if (!project) throw new Error("Missing Firebase project configuration.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`https://${region}-${project}.cloudfunctions.net/completeSocialSignIn`, {
        method: "POST",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success !== true) {
        throw new Error(payload.message || "Unable to prepare your account. Please try again.");
      }
      return payload.data as SocialProfile;
    } finally {
      clearTimeout(timeout);
    }
  })();
  requests.set(user, request);
  void request.catch(() => requests.delete(user));
  return request;
}

// Provision before Firebase publishes the session: profile listeners must not
// start while a new user's server-owned document is still missing.
export function installSocialProfileGuard(auth: Auth) {
  return beforeAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const token = await user.getIdTokenResult();
    if (["google.com", "apple.com"].includes(token.signInProvider || "")) {
      await completeSocialProfile(user);
    }
  });
}
