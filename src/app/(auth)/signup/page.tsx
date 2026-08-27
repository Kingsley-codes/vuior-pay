"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { continueWithGoogle } from "@/services/authService";
import { getAuthErrorMessage } from "@/services/authErrors";
import { setPendingRegistration } from "@/services/pendingRegistration";
import { requestRegistrationOtp } from "@/services/otpService";
import AuthFormShell from "@/components/auth/AuthFormShell";
import AuthInput from "@/components/auth/AuthInput";
import GoogleButton from "@/components/auth/GoogleButton";
import PhoneNumberInput from "@/components/phone-number-input";
import { hasCompletePhoneNumber } from "@/utils/inputFormatting";

const checkboxClass =
  "grid h-4 w-4 shrink-0 cursor-pointer appearance-none place-content-center rounded border-[1.5px] border-[#cfd5df] bg-white before:mt-[-2px] before:h-1.5 before:w-2.5 before:origin-center before:rotate-[-45deg] before:scale-0 before:border-b-2 before:border-l-2 before:border-white before:transition-transform before:duration-150 before:content-[''] checked:border-[#00a968] checked:bg-[#00a968] checked:before:scale-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,169,104,0.13)]";

type AccountType = "personal" | "business";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  businessName: string;
};

const initialForm: SignupForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  password: "",
  confirmPassword: "",
  accountType: "personal",
  businessName: "",
};

function validateForm(form: SignupForm) {
  const errors: Partial<Record<keyof SignupForm | "agreement", string>> = {};

  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Email is invalid";
  }

  if (!hasCompletePhoneNumber(form.phone)) {
    errors.phone = "Phone number is required";
  }

  if (!form.dob.trim()) {
    errors.dob = "Date of birth is required";
  } else {
    const [year, month, day] = form.dob.split("-").map(Number);
    const dateOfBirth = new Date(year, month - 1, day);
    const oldestAllowedDate = new Date(1930, 0, 1);
    const latestAllowedDate = new Date();
    latestAllowedDate.setFullYear(latestAllowedDate.getFullYear() - 14);

    const isValidDate =
      /^\d{4}-\d{2}-\d{2}$/.test(form.dob) &&
      dateOfBirth.getFullYear() === year &&
      dateOfBirth.getMonth() === month - 1 &&
      dateOfBirth.getDate() === day;

    if (!isValidDate || dateOfBirth < oldestAllowedDate) {
      errors.dob = "Enter a valid date of birth";
    } else if (dateOfBirth > latestAllowedDate) {
      errors.dob = "You must be at least 14 years old";
    }
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)) {
    errors.password = "Password must contain a number and symbol";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (form.accountType === "business" && !form.businessName.trim()) {
    errors.businessName = "Business name is required";
  }

  return errors;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupForm | "agreement" | "form", string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);

  function updateField(field: keyof SignupForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  }

  function updateAccountType(accountType: AccountType) {
    setForm((current) => ({
      ...current,
      accountType,
      businessName: accountType === "personal" ? "" : current.businessName,
    }));
    setErrors((current) => ({
      ...current,
      accountType: undefined,
      businessName: undefined,
      form: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    if (!agreed) {
      validationErrors.agreement =
        "Please agree to the Terms of Service and Privacy Policy";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const email = form.email.trim();

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email,
        password: form.password,
        phoneCountry: "",
        phoneLocal: form.phone,
        dob: form.dob,
        accountType: form.accountType,
        ...(form.accountType === "business"
          ? { businessName: form.businessName.trim() }
          : {}),
      };

      setPendingRegistration(payload);
      await requestRegistrationOtp(payload);
      router.push(
        `/verify-otp?email=${encodeURIComponent(email)}&flow=register`,
      );
    } catch (signupError) {
      setErrors({ form: getAuthErrorMessage(signupError) });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogle() {
    setErrors({});
    setSocialSubmitting(true);
    try {
      await continueWithGoogle();
      router.replace("/dashboard");
    } catch (googleError) {
      setErrors({ form: getAuthErrorMessage(googleError) });
    } finally {
      setSocialSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Create account"
      description="Join Vuior and start saving by paying bills early."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {errors.form ? (
          <div className="rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-3.5 py-2.5 text-[12px] text-[#be123c]">
            {errors.form}
          </div>
        ) : null}

        <div>
          <span className="mb-2 block text-[13px] font-semibold text-[#16234c]">
            Account type
          </span>
          <div className="grid grid-cols-2 overflow-hidden rounded-[9px] border border-[#d8dde7] bg-white">
            {(["personal", "business"] as const).map((accountType) => (
              <button
                key={accountType}
                type="button"
                onClick={() => updateAccountType(accountType)}
                className={`h-10 text-[12px] font-semibold capitalize transition ${
                  form.accountType === accountType
                    ? "bg-[#009d62] text-white"
                    : "text-[#526080] hover:bg-[#f8fafc]"
                }`}
              >
                {accountType}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            label="First name"
            type="text"
            name="firstName"
            placeholder="First name"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            error={errors.firstName}
            icon={<UserRound size={21} strokeWidth={1.8} />}
            required
          />
          <AuthInput
            label="Last name"
            type="text"
            name="lastName"
            placeholder="Last name"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            error={errors.lastName}
            icon={<UserRound size={21} strokeWidth={1.8} />}
            required
          />
        </div>

        {form.accountType === "business" ? (
          <AuthInput
            label="Business name"
            type="text"
            name="businessName"
            placeholder="Enter your business name"
            value={form.businessName}
            onChange={(event) =>
              updateField("businessName", event.target.value)
            }
            error={errors.businessName}
            icon={<BriefcaseBusiness size={21} strokeWidth={1.8} />}
            required
          />
        ) : null}

        <AuthInput
          label="Email address"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          error={errors.email}
          icon={<Mail size={21} strokeWidth={1.8} />}
          required
        />

        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-[#16234c]">
            Phone number
          </span>
          <PhoneNumberInput
            className={`vuior-phone-input--auth ${
              errors.phone ? "vuior-phone-input--error" : ""
            }`}
            name="phone"
            onChange={(value) => updateField("phone", value)}
            placeholder="Enter phone number"
            required
            value={form.phone}
          />
          {errors.phone ? (
            <span className="mt-1.5 block text-[11px] text-[#e11d48]">
              {errors.phone}
            </span>
          ) : null}
        </label>

        <AuthInput
          label="Date of birth"
          type="date"
          name="dob"
          value={form.dob}
          onChange={(event) => updateField("dob", event.target.value)}
          error={errors.dob}
          icon={<CalendarDays size={21} strokeWidth={1.8} />}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={errors.password}
          icon={<LockKeyhole size={21} strokeWidth={1.8} />}
          trailingIcon={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? (
                <EyeOff size={21} strokeWidth={1.8} />
              ) : (
                <Eye size={21} strokeWidth={1.8} />
              )}
            </button>
          }
          required
        />

        <p className="-mt-2 text-[11px] text-[#78829c]">
          At least 8 characters with a number and symbol.
        </p>

        <AuthInput
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          error={errors.confirmPassword}
          icon={<LockKeyhole size={21} strokeWidth={1.8} />}
          trailingIcon={
            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
            >
              {showConfirmPassword ? (
                <EyeOff size={21} strokeWidth={1.8} />
              ) : (
                <Eye size={21} strokeWidth={1.8} />
              )}
            </button>
          }
          required
        />

        <label className="flex cursor-pointer items-start gap-2.5 text-[12px] leading-5 text-[#526080]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => {
              setAgreed(event.target.checked);
              setErrors((current) => ({
                ...current,
                agreement: undefined,
                form: undefined,
              }));
            }}
            className={`${checkboxClass} mt-0.5`}
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms-of-service"
              className="font-medium text-[#009d62] hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-[#009d62] hover:underline"
            >
              Privacy Policy
            </Link>
            .
            {errors.agreement ? (
              <span className="mt-2 block text-[12px] text-[#e11d48]">
                {errors.agreement}
              </span>
            ) : null}
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || socialSubmitting}
          className="h-12 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[14px] font-semibold text-white shadow-[0_7px_17px_rgba(0,157,98,0.16)] transition hover:brightness-[0.98] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending code..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-5">
          <div className="h-px flex-1 bg-[#dfe3eb]" />
          <span className="text-[12px] text-[#78829c]">or</span>
          <div className="h-px flex-1 bg-[#dfe3eb]" />
        </div>

        <GoogleButton
          disabled={isSubmitting || socialSubmitting}
          label={socialSubmitting ? "Connecting..." : "Sign up with Google"}
          onClick={handleGoogle}
        />

        <p className="text-center text-[12px] text-[#33405f]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#009d62] hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}
