export default function EarlyPaymentNote({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-4 text-sm leading-6 ${className}`}>
      Payments on or after the due date earn no early-payment credits.
    </p>
  );
}
