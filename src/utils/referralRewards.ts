type ReferralReward = {
  type?: unknown;
  status?: unknown;
  referralRole?: unknown;
  reference?: unknown;
};

export function isSuccessfulReferral(item: ReferralReward) {
  if (!String(item.type || "").toLowerCase().includes("referral")) return false;
  if (!["completed", "success", "succeeded", "paid", "redeemed"].includes(
    String(item.status || "").trim().toLowerCase(),
  )) return false;
  if (item.referralRole) return item.referralRole === "referrer";
  // Legacy referrer rewards use "Referred by <referred user ID>";
  // the referred user's reward instead uses "Referral code <code>".
  return /^Referred by\s+\S/i.test(String(item.reference || "").trim());
}
