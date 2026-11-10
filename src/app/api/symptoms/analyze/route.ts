import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeSymptoms } from "@/lib/gemini";

const schema = z.object({ symptomText: z.string().min(2).max(500) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptomText } = schema.parse(body);
    const result = await analyzeSymptoms(symptomText);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
