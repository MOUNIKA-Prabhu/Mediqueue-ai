# Kiosk-MediQueue — Smart Hospital Self-Service Kiosk

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mediqueue--ai-blue?style=for-the-badge&logo=vercel)](https://mediqueue-ai-weld.vercel.app/)

An AI-powered, multilingual (English / Tamil) hospital self-service kiosk built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **MongoDB (Mongoose)**, and **Google Gemini AI**.

> 🌐 **Live Demo:** [https://mediqueue-ai-weld.vercel.app/](https://mediqueue-ai-weld.vercel.app/)

---

## ✨ Features

- 🌍 **Multilingual Support** — Language-persistent welcome screen (English / Tamil) with animated background
- 📝 **Patient Registration** — New patient registration with an on-screen virtual keyboard
- 🔍 **Patient Lookup** — Existing patient lookup by phone, with visit history and doctor-continuity logic
- 🏥 **Visit Type Flow** — Regular Checkup vs Specific Reason routing
- 🤖 **AI Symptom Triage** — Symptom-to-department AI recommendation (Gemini API) with automatic offline English/Tamil/Tanglish keyword fallback
- 📋 **Smart Queue Management** — Doctor-wise live queue with token assignment
- 💡 **Doctor Recommendations** — "Recommended alternative" doctor suggestion when a peer doctor has a shorter queue
- 🔊 **Voice Announcements** — Browser Speech Synthesis announcing registration, token number, and waiting time in the selected language
- 💰 **UPI QR Payments** — UPI QR code generation (any UPI app can scan) + Cash option with admin confirmation
- 🧾 **Printable Receipts** — A4 printable receipt via browser print
- 🔐 **Admin Panel** — Dashboard, doctor availability toggle, patient search, live queue viewer, cash payment confirmation, reports with CSV export
- 📊 **Full Database Schema** — MongoDB collections for patients, doctors, departments, appointments, payments, and more

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | Full-stack React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| [Google Gemini AI](https://ai.google.dev/) | AI-powered symptom analysis |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Zod](https://zod.dev/) | Schema validation |
| [Vercel](https://vercel.com/) | Deployment |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# Clone the repository
git clone https://github.com/AnanyaSekar/Kiosk-mediqueue.git
cd Kiosk-mediqueue

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your MongoDB URI, Clerk keys, and (optionally) Gemini API key

# Seed the database with demo data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the kiosk and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | MongoDB connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ❌ (falls back to keyword matcher) |
| `HOSPITAL_UPI_ID` | UPI VPA for payments | ✅ |
| `HOSPITAL_NAME` | Hospital name for receipts | ✅ |

> **Note:** If you skip the Gemini API key, symptom analysis still works using the built-in keyword fallback — it just won't be as smart about phrasing it hasn't seen before.

---

## 📁 Project Structure

```
src/
  app/                  Next.js App Router pages + API routes
    api/                REST endpoints (patients, doctors, appointments,
                         symptoms/analyze, queue, payments, admin/*)
    patient/new         Registration + visit-type + symptoms flow
    patient/existing    Phone lookup for returning patients
    doctors/            Doctor list with AI-driven recommendations
    queue/[id]          Token + queue position + voice announcement
    payment/[id]        UPI / Cash payment
    receipt/[id]        Printable A4 receipt
    admin/              Admin panel (dashboard, doctors, patients, queue,
                         payments, reports)
    display/            Public queue display
  components/           Reusable UI (VirtualKeyboard, DoctorCard, etc.)
  contexts/             LanguageContext, PatientContext
  hooks/                useVoice (speech synthesis), useVirtualKeyboard
  lib/                  MongoDB client, gemini.ts, queue-logic.ts, upi.ts
  models/               Mongoose schemas (Patient, Doctor, Appointment, etc.)
  constants/translations  en.ts / ta.ts dictionaries
```

---

## ☁️ Deploying to Vercel

1. Push this repo to GitHub
2. Import it into [Vercel](https://vercel.com/)
3. Add the environment variables from `.env` in Vercel project settings
4. Vercel runs `npm install` → `next build` automatically
5. Make sure your MongoDB Atlas allows connections from Vercel's IPs (or use `0.0.0.0/0`)

---

## 📝 Roadmap

- [ ] Server-side rate limiting / input sanitization middleware
- [ ] PDF export for reports
- [ ] Voice input (speech recognition)
- [ ] Card payment gateway integration
- [ ] Automated tests
- [ ] SMS/WhatsApp notifications for queue updates

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for intelligent symptom analysis
- [Vercel](https://vercel.com/) for hosting
- [Next.js](https://nextjs.org/) for the amazing framework

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/AnanyaSekar">Ananya Sekar</a>
</p>
