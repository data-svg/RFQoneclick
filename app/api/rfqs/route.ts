import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { z } from "zod";
import { sendInviteEmail } from "@/lib/mailer";
import crypto from "crypto";

const SERVICES = ["av","catering","security","staging","lighting","sound","decor","other"] as const;
const Body = z.object({
  event_name: z.string().min(2),
  event_date: z.string().min(1),
  expected_attendance: z.coerce.number().int().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  services: z.array(z.enum(SERVICES)).min(1),
  region: z.string().optional(),
  due_at: z.string().min(1),
});

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // 1) Organizer company (find or create)
  const { data: orgRow } = await supabase.from("companies").select("id").eq("type","organizer").limit(1).single();
  let organization_id = orgRow?.id as string | undefined;
  if (!organization_id) {
    const { data: newOrg } = await supabase.from("companies").insert({ name: "Demo Org", type: "organizer" }).select("id").single();
    organization_id = newOrg?.id as string | undefined;
  }

  // 2) Event
  const { data: evt, error: evtErr } = await supabase
    .from("events")
    .insert({ name: data.event_name, organization_id, event_date: data.event_date, expected_attendance: data.expected_attendance, region: data.region || null })
    .select("id").single();
  if (evtErr || !evt?.id) {
    return NextResponse.json({ error: evtErr?.message ?? "Failed to create event" }, { status: 500 });
  }

  // 3) RFQ
  const { data: rfq, error: rfqErr } = await supabase
    .from("rfqs")
    .insert({ event_id: evt.id, title: data.title, description: data.description, services: data.services, due_at: data.due_at, status: "open" })
    .select("id,title").single();
  if (rfqErr || !rfq?.id) {
    return NextResponse.json({ error: rfqErr?.message ?? "Failed to create RFQ" }, { status: 500 });
  }

  // 4) Match suppliers (services overlap + optional region), cap 50
  let query = supabase.from("suppliers").select("id,contact_email,region,services").eq("is_active", true).overlaps("services", data.services).limit(50);
  if (data.region) query = query.eq("region", data.region);
  const { data: suppliers, error: supErr } = await query;
  if (supErr) {
    return NextResponse.json({ error: supErr.message }, { status: 500 });
  }

  // 5) Create invites
  const invites = (suppliers || []).map(s => ({
    rfq_id: rfq.id,
    supplier_id: s.id,
    invite_email: s.contact_email,
    token: (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2),
    status: "sent",
  }));

  if (invites.length) {
    const { error: invErr } = await supabase.from("rfq_invites").insert(invites);
    if (invErr) {
      return NextResponse.json({ error: invErr.message }, { status: 500 });
    }
    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    Promise.allSettled(invites.map(i =>
      sendInviteEmail({ to: i.invite_email, rfqTitle: rfq.title, inviteUrl: `${base}/supplier/rfqs/${rfq.id}?token=${i.token}` })
    )).catch(err => console.warn("[mailer] batch error", err));
  }

  return NextResponse.json({ id: rfq.id, invited: invites.length }, { status: 201 });
}
