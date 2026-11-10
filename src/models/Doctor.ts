import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  departmentId: mongoose.Types.ObjectId;
  experienceYears: number;
  consultingFee: number;
  arrivalTime: string;
  endTime: string;
  isAvailable: boolean;
  unavailableReason?: string;
  room: string;
  specialty: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
  createdAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    experienceYears: { type: Number, default: 5 },
    consultingFee: { type: Number, required: true, default: 500 },
    arrivalTime: { type: String, default: "09:00 AM" },
    endTime: { type: String, default: "05:00 PM" },
    isAvailable: { type: Boolean, default: true },
    unavailableReason: { type: String },
    room: { type: String, default: "OPD 101" },
    specialty: { type: String, default: "General Specialist" },
    lastUpdatedBy: { type: String, default: "Admin / OPD Desk" },
    lastUpdatedAt: { type: String, default: "Just Now" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);
