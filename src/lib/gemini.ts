import { fallbackAnalyzeSymptoms } from "./symptom-fallback";
import { SymptomAnalysisResult } from "@/types";

const DEPARTMENTS = [
  "General Medicine",
  "General Dentistry",
  "Periodontics",
  "Oral Surgery",
  "Cardiology",
  "Ophthalmology",
  "ENT",
  "General Surgery",
];

/**
 * Sends the patient's free-text symptom description (English / Tamil /
 * Tanglish) to Gemini and asks it to classify it into one of the hospital's
 * departments. Falls back to a local keyword matcher if GEMINI_API_KEY is
 * missing or the request fails, so the kiosk never blocks on a network call.
 */
export async function analyzeSymptoms(symptomText: string): Promise<SymptomAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fb = fallbackAnalyzeSymptoms(symptomText);
    return { ...fb, confidence: "medium", source: "fallback" };
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const prompt = `You are a hospital triage assistant. A patient described their
symptoms in English, Tamil, or Tanglish (romanized Tamil): "${symptomText}"

Classify this into exactly one primary department from this list:
${DEPARTMENTS.join(", ")}

Also list up to 2 related departments from the same list.

Respond with ONLY valid JSON, no markdown, in this exact shape:
{"department": "<one of the list>", "relatedDepartments": ["<dept>", "<dept>"]}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

    const data = await res.json();
    const textOut: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOut) throw new Error("Empty Gemini response");

    const cleaned = textOut.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!DEPARTMENTS.includes(parsed.department)) throw new Error("Unrecognized department");

    return {
      department: parsed.department,
      relatedDepartments: (parsed.relatedDepartments || []).filter((d: string) =>
        DEPARTMENTS.includes(d)
      ),
      confidence: "high",
      source: "gemini",
    };
  } catch (err) {
    console.error("Gemini symptom analysis failed, using fallback:", err);
    const fb = fallbackAnalyzeSymptoms(symptomText);
    return { ...fb, confidence: "low", source: "fallback" };
  }
}
