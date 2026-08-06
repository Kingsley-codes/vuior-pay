type GoogleButtonProps = {
  label?: string;
};

export default function GoogleButton({
  label = "Continue with Google",
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      className="flex h-13.5 w-full items-center justify-center gap-4 rounded-lg border border-[#d8dde7] bg-white text-[15px] font-semibold text-[#18254d] transition hover:bg-[#f8fafc] active:scale-[0.995]"
    >
      <svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M21.6 12.227c0-.71-.064-1.395-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.891-1.741 2.981-4.305 2.981-7.35Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.041.955-3.386.955-2.605 0-4.81-1.759-5.6-4.123H3.06v2.59A9.998 9.998 0 0 0 12 22Z"
        />
        <path
          fill="#FBBC05"
          d="M6.4 13.9A6.01 6.01 0 0 1 6.087 12c0-.659.114-1.3.314-1.9V7.51H3.06A9.998 9.998 0 0 0 2 12c0 1.614.386 3.141 1.06 4.49L6.4 13.9Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.96 2.99 14.696 2 12 2a9.998 9.998 0 0 0-8.94 5.51L6.4 10.1c.791-2.364 2.996-4.123 5.6-4.123Z"
        />
      </svg>

      {label}
    </button>
  );
}
