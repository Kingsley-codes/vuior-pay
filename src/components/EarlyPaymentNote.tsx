export default function EarlyPaymentNote({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-4 text-xs leading-5 ${className}`}>
      Payments on or after the due date earn no early-payment credits.
    </p>
  );
}
