export function formatCurrencyInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [wholeRaw = "", ...decimalParts] = cleaned.split(".");
  const whole = wholeRaw.replace(/^0+(?=\d)/, "").slice(0, 12);
  const decimal = decimalParts.join("").slice(0, 2);
  const grouped = (whole || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return cleaned.includes(".")
    ? `${grouped}.${decimal}`
    : wholeRaw
      ? grouped
      : "";
}

export function currencyInputNumber(value: string) {
  return Number(value.replace(/,/g, "")) || 0;
}

export function formatUSPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("1")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function usPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits;
}
