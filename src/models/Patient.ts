import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  address: string;
  bloodGroup: string;
  emergencyContact?: string;
  createdAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    phone: { type: String, required: true, unique: true, index: true },
    address: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    emergencyContact: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
