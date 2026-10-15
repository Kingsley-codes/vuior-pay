export const ADDRESS_REQUIRED_MESSAGE =
  "Add your address to your profile before creating a bill.";

export function profileAddressText(address: unknown): string {
  if (typeof address === "string") return address.trim();
  if (
    address !== null &&
    typeof address === "object" &&
    "formatted_address" in address &&
    typeof address.formatted_address === "string"
  ) {
    return address.formatted_address.trim();
  }
  return "";
}

export const hasProfileAddress = (address: unknown): boolean =>
  Boolean(profileAddressText(address));
