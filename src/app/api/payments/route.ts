import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { Appointment } from "@/models/Appointment";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { appointmentId, amount, mode } = body;

    if (!appointmentId || !amount || !mode) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const isUpi = mode.toUpperCase() === "UPI";
    const status = isUpi ? "PAID" : "CASH_PENDING";
    const upiTransactionId = isUpi ? `TXN${Date.now()}` : undefined;

    let qrCodeDataUrl: string | undefined;

    if (isUpi) {
      // Generate real upi://pay URI and convert to base64 Data URL QR Code image using qrcode library
      const upiUri = `upi://pay?pa=mediqueue@hospital&pn=MediQueue%20Hospital&am=${amount}&tr=${upiTransactionId}&cu=INR`;
      qrCodeDataUrl = await QRCode.toDataURL(upiUri, {
        width: 300,
        margin: 2,
        color: {
          dark: "#0141AB",
          light: "#FFFFFF",
        },
      });
    }

    const payment = await Payment.create({
      appointmentId,
      amount: Number(amount),
      mode: isUpi ? "UPI" : "CASH",
      status,
      upiTransactionId,
      qrCodeDataUrl,
    });

    return NextResponse.json({ success: true, payment, qrCodeDataUrl }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/payments error:", err);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const payments = await Payment.find().sort({ createdAt: -1 }).populate("appointmentId");
    return NextResponse.json(payments);
  } catch (err: any) {
    console.error("GET /api/payments error:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
