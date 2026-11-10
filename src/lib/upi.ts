/**
 * Builds a standard UPI deep-link payment string. Any UPI app (GPay, PhonePe,
 * Paytm, etc.) can scan the resulting QR code and pre-fill the amount.
 */
export function buildUpiUri(params: {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  transactionRefId: string;
}): string {
  const q = new URLSearchParams({
    pa: params.payeeVpa,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    cu: "INR",
    tn: params.transactionNote,
    tr: params.transactionRefId,
  });
  return `upi://pay?${q.toString()}`;
}
