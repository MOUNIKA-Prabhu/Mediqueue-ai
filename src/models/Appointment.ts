import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  token: number;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  visitType: "REGULAR_CHECKUP" | "SPECIFIC_REASON" | "EMERGENCY";
  symptomText?: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  queuePosition: number;
  createdAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    token: { type: Number, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    visitType: {
      type: String,
      enum: ["REGULAR_CHECKUP", "SPECIFIC_REASON", "EMERGENCY"],
      default: "REGULAR_CHECKUP",
    },
    symptomText: { type: String },
    status: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "WAITING",
    },
    queuePosition: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
