export type FAQCategory =
  | "Account Setup"
  | "Uploading Bills"
  | "Payments"
  | "Credit Earned"
  | "Referrals"
  | "Others";

export interface FAQItem {
  value: string;
  title: string;
  content: string;
  category: FAQCategory;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  "Account Setup",
  "Uploading Bills",
  "Payments",
  "Credit Earned",
  "Referrals",
  "Others",
];

export const MOBILE_FAQS: FAQItem[] = [
  {
    value: "q1",
    title: "What is Vuior Billpay?",
    content:
      "Vuior Billpay is a bill payment platform designed to help users pay their bills on time, manage recurring payments, and track savings by optimizing how and when bills are paid. Our platform analyzes bills, tracks payment patterns, and suggests the best time to pay for maximum savings.",
    category: "Account Setup",
  },
  {
    value: "q4",
    title: "How do I get started with Vuior Billpay?",
    content:
      "Sign up at www.vuior.com or in this app, complete your profile, add your bills, and manage or pay them from your dashboard.",
    category: "Account Setup",
  },
  {
    value: "q6",
    title: "Is Vuior Billpay secure?",
    content:
      "Yes. Vuior Billpay uses encryption, secure servers, and industry-standard practices to keep your financial data safe. We do not sell or share your data without your consent.",
    category: "Account Setup",
  },
  {
    value: "q10",
    title: "Is there a mobile app?",
    content:
      "Yes. You can use the Vuior mobile app for core bill and account features. Some flows may also be available on www.vuior.com.",
    category: "Account Setup",
  },
  {
    value: "q5",
    title: "What types of bills can I pay with Vuior?",
    content:
      "You can pay utilities, credit cards, phone bills, rent, car loans, and more. We're continuously expanding our supported bill categories.",
    category: "Uploading Bills",
  },
  {
    value: "q13",
    title: "How do I upload a bill?",
    content:
      "Go to the Bills tab and tap Create Bill. You can attach a document by taking a photo, choosing from your photo library, or browsing files. For photos, our AI will try to auto-fill the bill details.",
    category: "Uploading Bills",
  },
  {
    value: "q14",
    title: "Can I edit a bill after creating it?",
    content:
      "Yes. On the Bills page, find your bill under Pending and tap the edit icon (pencil) next to the delete icon. You can update the amount, due date, account number, or upload a new document.",
    category: "Uploading Bills",
  },
  {
    value: "q2",
    title: "How does Vuior Billpay work?",
    content:
      "Users link their bills to the platform, choose a payment method, and schedule or automate payments. Vuior tracks due dates and offers savings insights based on early payments and bill behavior.",
    category: "Payments",
  },
  {
    value: "q3",
    title: "Is there a fee to use Vuior Billpay?",
    content:
      "Vuior Billpay is free to join. Some advanced features, such as early payment rewards or special financing options, may include optional service fees, which are clearly disclosed before use.",
    category: "Payments",
  },
  {
    value: "q7",
    title: "Can I cancel or edit a scheduled payment?",
    content:
      "Yes, payments can be edited or canceled up to 24 hours before the scheduled processing date.",
    category: "Payments",
  },
  {
    value: "q8",
    title: "What happens if a payment fails?",
    content:
      "If a payment fails due to insufficient funds or a processing error, you will be notified immediately. You can retry the payment or update your payment method.",
    category: "Payments",
  },
  {
    value: "q9",
    title: "What is Vuior Billpay's refund policy?",
    content:
      "Refunds are available only if a payment was processed in error or duplicated due to a system malfunction. Refund requests must be submitted within 7 days of the transaction.\n\nPlease contact info@vuior.com with your transaction details to begin the refund process. Note: Refunds do not apply to successfully processed bill payments.",
    category: "Payments",
  },
  {
    value: "q15",
    title: "How do I earn credits?",
    content:
      "Credits are earned when your bill payment is verified and marked as Paid (green). The amount earned depends on how early you pay — up to 15% for paying 15+ days early, plus an extra 3% bonus when auto-pay is enabled.",
    category: "Credit Earned",
  },
  {
    value: "q16",
    title: "When are credits applied to my account?",
    content:
      "Credits are applied after admin verification of your bill payment. The reward is locked in using the date you paid, then added to your Available Credits balance when the bill changes from In review to Paid.",
    category: "Credit Earned",
  },
  {
    value: "q11",
    title: "How can I track my bill payment history?",
    content:
      "Use the Activity tab for bills and recent payments, and the Credits Tracker for credit movements. Your dashboard summarizes savings and payments.",
    category: "Credit Earned",
  },
  {
    value: "q17",
    title: "How does the referral program work?",
    content:
      "Share your referral code with friends. When they join and become a verified bill payer ($1,000+ in bill payments this year), you both earn referral credits. Go to the Referral tab to find your code and track earnings.",
    category: "Referrals",
  },
  {
    value: "q18",
    title: "How do I redeem a referral code?",
    content:
      "Go to the Referral tab, scroll to the Redeem Code section, enter the code, and tap Redeem Now. You must be a verified bill payer ($1,000+ in bill payments this year) to redeem.",
    category: "Referrals",
  },
  {
    value: "q20",
    title: "How do notifications work?",
    content:
      "Vuior sends notifications for:\n\n• Bill Reminders — alerts before your bills are due so you never miss a payment.\n• Payment Confirmations — confirmation when your payment is verified (In review → Paid).\n• Credit Updates — when credits are earned or received.\n• Referral Rewards — when friends join and you earn rewards.\n• Savings Insights — tips on the best time to pay for maximum savings.\n\nPush notifications will be enabled in a future update via your device settings and our messaging backend. For now, check the Activity tab for bill updates and the Credits tab for balance changes.",
    category: "Others",
  },
  {
    value: "q21",
    title: "How do I cancel recurring credit payments?",
    content:
      "To cancel a recurring payment (daily, weekly, or monthly), go to the Credits tab → Add Credit. If you have an active recurring plan, you'll see a 'Manage Recurring' option. You can also contact support at info@vuior.com or +1 (833) 367-1826 to cancel any active recurring payment immediately. Cancellations take effect before the next scheduled payment.",
    category: "Payments",
  },
  {
    value: "q22",
    title: "What is the Organizer tab?",
    content:
      "The Organizer (calendar) tab shows your bills on a monthly calendar view. Days with bills are marked with colored dots:\n\n• Red = Active\n• Orange = In review\n• Green = Paid\n\nTap any future date to create a new bill with that due date pre-filled. Tap a date with a bill to view it. The + button lets you create a bill anytime.",
    category: "Uploading Bills",
  },
  {
    value: "q23",
    title: "What are the auto-pay benefits?",
    content:
      "Enabling auto-pay on your bills gives you an extra +3% savings bonus on top of the early payment savings tiers. Combined with paying 15+ days early, you can earn up to 18% in total savings. Auto-pay ensures your bills are paid on time automatically, reducing the risk of late fees.",
    category: "Payments",
  },
  {
    value: "q24",
    title: "How does Vuior analyze my bills?",
    content:
      "Our platform analyzes your bills, tracks payment patterns, and suggests the best time to pay for maximum savings. The more bills you manage through Vuior, the better our insights become. We use this data to help you optimize your payment schedule and maximize credit earnings.",
    category: "Credit Earned",
  },
  {
    value: "q25",
    title: "Can I view my uploaded bill documents?",
    content:
      "Yes. Go to the Activity page and tap any bill entry. If a document was uploaded, you'll see a 'View Document' button in the detail modal. You can also see a document icon on bill rows that have attached documents. All documents are securely stored and accessible anytime.",
    category: "Uploading Bills",
  },
  {
    value: "q12",
    title: "Does Vuior Billpay offer customer support?",
    content:
      "Yes. Our support team is available Monday–Friday, 9am–6pm EST. Reach us at info@vuior.com or +1 (833) 367-1826, or use Contact us in the app menu. You can also use Vuior AI in the sidebar for instant answers to common questions.",
    category: "Others",
  },
  {
    value: "q19",
    title: "What do the bill statuses mean?",
    content:
      "Active = bill is ready for payment.\nIn review (yellow) = payment was submitted and is awaiting admin verification. Any early-payment reward is locked in using the payment date.\nPaid (green) = payment has been verified and the locked early-payment credits have been added to your balance.",
    category: "Others",
  },
  {
    value: "q26",
    title: "Is my data safe with Vuior?",
    content:
      "Absolutely. We use bank-level encryption, secure servers, and comply with industry-standard data protection practices. Your financial data is never sold or shared without your consent. All bill documents are stored securely in encrypted cloud storage. Payments are processed through Stripe, a PCI-compliant payment processor.",
    category: "Others",
  },
];
