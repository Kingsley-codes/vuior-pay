"use client";

import { PhoneInput, type PhoneInputProps } from "react-international-phone";

type PhoneNumberInputProps = Omit<
  PhoneInputProps,
  "className" | "defaultCountry" | "forceDialCode" | "inputProps"
> & {
  className?: string;
  inputProps?: PhoneInputProps["inputProps"];
};

export default function PhoneNumberInput({
  className = "",
  inputProps,
  ...props
}: PhoneNumberInputProps) {
  return (
    <PhoneInput
      className={`vuior-phone-input ${className}`.trim()}
      defaultCountry="us"
      forceDialCode
      inputProps={{
        autoComplete: "tel",
        inputMode: "tel",
        ...inputProps,
      }}
      {...props}
    />
  );
}
