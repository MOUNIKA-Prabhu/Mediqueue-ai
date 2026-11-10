"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/contexts/PatientContext";
import GlassCard from "@/components/GlassCard";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import BackButton from "@/components/BackButton";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(1).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  address: z.string().min(4, "Address is required"),
  bloodGroup: z.string().min(1, "Select blood group"),
  emergencyContact: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit number"),
});

type FormValues = z.infer<typeof schema>;

const TEXT_FIELDS: { name: keyof FormValues; labelKey: "name" | "address" | "phone" | "emergencyContact" }[] = [
  { name: "name", labelKey: "name" },
  { name: "phone", labelKey: "phone" },
  { name: "address", labelKey: "address" },
  { name: "emergencyContact", labelKey: "emergencyContact" },
];

export default function NewPatientPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { setPatient } = usePatient();
  const { activeField, open, close } = useVirtualKeyboard();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "MALE", bloodGroup: "" },
  });

  const values = watch();

  const onKey = (char: string) => {
    if (!activeField) return;
    const current = (values[activeField as keyof FormValues] as string) || "";
    setValue(activeField as keyof FormValues, (current + char) as never, { shouldValidate: true });
  };

  const onBackspace = () => {
    if (!activeField) return;
    const current = (values[activeField as keyof FormValues] as string) || "";
    setValue(activeField as keyof FormValues, current.slice(0, -1) as never, { shouldValidate: true });
  };

  const onSubmit = (data: FormValues) => {
    setPatient({ ...data, isExisting: false });
    router.push("/patient/new/visit-type");
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <BackButton fallbackHref="/patient-type" />
      <div className="mx-auto max-w-xl">
        <GlassCard>
          <h1 className="mb-6 text-kiosk-lg font-bold text-slate-800">{t("newPatient")}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pb-20">
            {TEXT_FIELDS.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-kiosk-sm font-medium text-slate-600">
                  {t(f.labelKey)}
                </label>
                <input
                  {...register(f.name)}
                  onFocus={() => open(f.name)}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-kiosk-sm shadow-sm"
                />
                {errors[f.name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[f.name]?.message as string}</p>
                )}
              </div>
            ))}

            <div>
              <label className="mb-1 block text-kiosk-sm font-medium text-slate-600">{t("age")}</label>
              <input
                type="number"
                {...register("age")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-kiosk-sm shadow-sm"
              />
              {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-kiosk-sm font-medium text-slate-600">{t("gender")}</label>
              <div className="flex gap-3">
                {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setValue("gender", g)}
                    className={`flex-1 rounded-xl px-4 py-3 text-kiosk-sm font-medium shadow-sm ${
                      values.gender === g ? "bg-brand-blue text-white" : "bg-white text-slate-700"
                    }`}
                  >
                    {t(g === "MALE" ? "male" : g === "FEMALE" ? "female" : "other")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-kiosk-sm font-medium text-slate-600">
                {t("bloodGroup")}
              </label>
              <select
                {...register("bloodGroup")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-kiosk-sm shadow-sm"
              >
                <option value="">--</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && (
                <p className="mt-1 text-sm text-red-500">{errors.bloodGroup.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-4 rounded-2xl bg-brand-green px-6 py-4 text-kiosk-base font-bold text-white shadow-lg"
            >
              {t("next")}
            </button>
          </form>
        </GlassCard>
      </div>

      {activeField && (
        <VirtualKeyboard
          fieldLabel={t(TEXT_FIELDS.find((f) => f.name === activeField)?.labelKey ?? "name")}
          onKey={onKey}
          onBackspace={onBackspace}
          onDone={close}
        />
      )}
    </main>
  );
}
