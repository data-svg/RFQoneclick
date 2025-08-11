import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function RFQDetail({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: rfq } = await supabase.from("rfqs").select("id,title,description,services,due_at,event_id,status").eq("id", params.id).single();
  if (!rfq) return <div className="card">RFQ not found.</div>;
  const { data: evt } = await supabase.from("events").select("name,event_date,expected_attendance,region").eq("id", rfq.event_id).single();
  const { data: invites = [] } = await supabase.from("rfq_invites").select("invite_email,token").eq("rfq_id", params.id);
  const { data: quotes = [] } = await supabase.from("quotes").select("supplier_email,company,price,currency,notes").eq("rfq_id", params.id);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{rfq.title}</h1>
            <div className="text-sm text-slate-600">Event: {evt?.name} • {evt?.event_date} • {evt?.expected_attendance} ppl • Region: {evt?.region||"—"}</div>
          </div>
          <div><span className="badge">{(rfq as any).status}</span></div>
        </div>
        {rfq.description && <p className="mt-3 text-slate-700">{rfq.description}</p>}
        <h3 className="mt-4 font-semibold">Services</h3><div>{(rfq as any).services?.map?.((s:string)=>(<span key={s} className="badge mr-1">{s}</span>))}</div>

        <h3 className="mt-4 font-semibold">Invites</h3>
        {!invites.length && <div className="text-sm text-slate-600">No invites yet.</div>}
        {!!invites.length && (
          <div className="mt-1 space-y-1 text-sm">
            {invites.map(i => (
              <div key={i.token} className="flex items-center gap-2">
                <span className="badge">{i.invite_email}</span>
                <span className="text-slate-500">Token: {i.token}</span>
              </div>
            ))}
          </div>
        )}

        <h3 className="mt-4 font-semibold">Quotes</h3>
        {!quotes.length && <div className="text-sm text-slate-600">No quotes yet.</div>}
        {!!quotes.length && (
          <div className="mt-1 space-y-1 text-sm">
            {quotes.map((q, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="badge">{q.supplier_email}</span>
                <span className="badge">{q.company||"—"}</span>
                <span className="badge">{q.currency} {Number(q.price||0).toFixed(2)}</span>
                <span className="badge">{q.notes||"—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
