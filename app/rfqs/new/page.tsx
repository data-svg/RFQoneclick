"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import Button from "@/components/Button";

const SERVICES = ["av","catering","security","staging","lighting","sound","decor","other"] as const;
const schema = z.object({
  event_name: z.string().min(2, "Event name is required"),
  event_date: z.string().min(1, "Event date is required"),
  expected_attendance: z.coerce.number().int().min(1, "Attendance must be at least 1"),
  title: z.string().min(2, "RFQ title is required"),
  description: z.string().optional(),
  services: z.array(z.enum(SERVICES)).min(1, "Pick at least one service"),
  region: z.string().optional(),
  due_at: z.string().min(1, "Due date is required"),
});
type FormValues = z.infer<typeof schema>;

export default function NewRFQPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/rfqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const t = await res.text(); throw new Error(t || "Failed to create RFQ"); }
    const { id } = await res.json();
    window.location.href = `/rfqs/${id}`;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create RFQ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 card">
        <FormInput label="Event name" placeholder="e.g., Product Launch" {...register("event_name")} error={errors.event_name} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormInput label="Event date" type="date" {...register("event_date")} error={errors.event_date as any} />
          <FormInput label="Attendance" type="number" min={1} {...register("expected_attendance", { valueAsNumber: true })} error={errors.expected_attendance as any} />
          <FormInput label="RFQ due date" type="date" {...register("due_at")} error={errors.due_at} />
        </div>
        <FormInput label="RFQ title" placeholder="e.g., AV for 500 pax" {...register("title")} error={errors.title} />
        <FormTextarea label="Description" rows={4} placeholder="Requirements, quantities, special notes" {...register("description")} error={errors.description as any} />
        <div>
          <div className="label">Services needed</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SERVICES.map(s => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input type="checkbox" value={s} {...register("services")} />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
          {errors.services && <div className="text-xs text-red-600 mt-1">Pick at least one service</div>}
        </div>
        <FormInput label="Region (optional)" placeholder="e.g., London, UK" {...register("region")} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create RFQ & Auto‑Invite"}</Button>
      </form>
    </div>
  );
}
