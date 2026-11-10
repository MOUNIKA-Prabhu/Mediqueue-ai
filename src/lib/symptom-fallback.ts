/**
 * Offline symptom -> department matcher.
 * Used automatically when GEMINI_API_KEY is not configured, or if the
 * Gemini API call fails for any reason, so the kiosk keeps working.
 * Understands English, Tamil script, and Tanglish (romanized Tamil).
 */

interface Rule {
  department: string;
  related: string[];
  keywords: string[];
}

const RULES: Rule[] = [
  {
    department: "Periodontics",
    related: ["General Dentistry", "Oral Surgery"],
    keywords: [
      "bleeding gums", "gum bleed", "gum pain", "gum swelling",
      "eerpu vali", "pal eerpu", "ஈறு வலி", "ஈறுகளில் இரத்தம்",
    ],
  },
  {
    department: "General Dentistry",
    related: ["Periodontics", "Oral Surgery"],
    keywords: [
      "tooth pain", "toothache", "tooth ache", "cavity", "pal vali",
      "pal noyu", "பல் வலி", "பல் நோய்",
    ],
  },
  {
    department: "Oral Surgery",
    related: ["General Dentistry", "Periodontics"],
    keywords: ["tooth extraction", "wisdom tooth", "jaw pain", "vaai arivai"],
  },
  {
    department: "Cardiology",
    related: ["General Medicine", "General Surgery"],
    keywords: [
      "chest pain", "heart pain", "palpitation", "breathlessness",
      "nenju vali", "மார்பு வலி", "இதய வலி",
    ],
  },
  {
    department: "Ophthalmology",
    related: ["General Medicine", "ENT"],
    keywords: [
      "eye pain", "eye redness", "blurry vision", "kan vali",
      "கண் வலி", "கண் எரிச்சல்",
    ],
  },
  {
    department: "ENT",
    related: ["General Medicine", "Ophthalmology"],
    keywords: [
      "ear pain", "throat pain", "sore throat", "nose block",
      "kaadhu vali", "thondai vali", "காது வலி", "தொண்டை வலி",
    ],
  },
  {
    department: "General Medicine",
    related: ["ENT", "Cardiology"],
    keywords: [
      "fever", "headache", "cold", "cough", "body pain", "weakness",
      "kaaichal", "thalai vali", "காய்ச்சல்", "தலை வலி", "இருமல்",
    ],
  },
  {
    department: "General Surgery",
    related: ["Cardiology", "General Medicine"],
    keywords: ["stomach pain", "abdomen pain", "vayiru vali", "வயிறு வலி", "hernia"],
  },
];

const DEFAULT_DEPARTMENT = "General Medicine";

export function fallbackAnalyzeSymptoms(rawText: string): {
  department: string;
  relatedDepartments: string[];
} {
  const text = rawText.toLowerCase();

  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) {
        return { department: rule.department, relatedDepartments: rule.related };
      }
    }
  }

  return { department: DEFAULT_DEPARTMENT, relatedDepartments: ["ENT", "Cardiology"] };
}
