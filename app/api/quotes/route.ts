import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { z } from "zod";

const Body = z.object({
  rfq_id: z.string().uuid(),
  token: z.string().min(6),
  supplier_email: z.string().email().optional(),
  company: z.string().optional(),
  price: z.coerce.number().min(0),
  currency: z.string().default("GBP"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;

  // Validate invite
  const { data: inv } = await supabase.from("rfq_invites").select("id,rfq_id,invite_email,token").eq("token", d.token).eq("rfq_id", d.rfq_id).single();
  if (!inv) return NextResponse.json({ error: "Invalid invite token" }, { status: 400 });

  const { error } = await supabase.from("quotes").insert({
    rfq_id: d.rfq_id,
    invite_token: d.token,
    supplier_email: d.supplier_email || inv.invite_email,
    company: d.company || null,
    price: d.price,
    currency: d.currency || "GBP",
    notes: d.notes || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
