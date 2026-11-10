import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  appointmentId: mongoose.Types.ObjectId;
  amount: number;
  mode: "UPI" | "CASH";
  status: "PAID" | "CASH_PENDING";
  upiTransactionId?: string;
  qrCodeDataUrl?: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ["UPI", "CASH"], required: true },
    status: { type: String, enum: ["PAID", "CASH_PENDING"], required: true },
    upiTransactionId: { type: String },
    qrCodeDataUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
