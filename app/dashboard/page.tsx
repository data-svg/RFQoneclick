import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function Dashboard() {
  const supabase = createSupabaseServer();
  const { data: rfqs = [] } = await supabase.from("rfqs").select("id,title,due_at,status,services");
  return (
    <div className="space-y-6">
      <header><h1 className="text-2xl font-semibold">Dashboard</h1><p className="text-sm text-slate-600">Overview of RFQs and activity.</p></header>
      <div className="card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-600">
              <th className="py-2 px-2 border-b">RFQ</th>
              <th className="py-2 px-2 border-b">Services</th>
              <th className="py-2 px-2 border-b">Due</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {rfqs.length===0 && <tr><td colSpan={5} className="py-6 text-center text-slate-600">No RFQs yet. Create one.</td></tr>}
            {rfqs.map(r => (
              <tr key={r.id}>
                <td className="py-3 px-2 border-b">{r.title}</td>
                <td className="py-3 px-2 border-b">{(r as any).services?.map?.((s:string)=>(<span key={s} className="badge mr-1">{s}</span>))}</td>
                <td className="py-3 px-2 border-b">{(r as any).due_at||"—"}</td>
                <td className="py-3 px-2 border-b"><span className="badge">{(r as any).status}</span></td>
                <td className="py-3 px-2 border-b text-right whitespace-nowrap"><Link className="btn btn-ghost" href={`/rfqs/${r.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/rfqs/new" className="btn btn-primary">Create RFQ</Link>
    </div>
  );
}
