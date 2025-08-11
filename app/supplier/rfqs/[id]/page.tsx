"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";

export default function SupplierQuotePage({ params }: { params: { id: string } }) {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token") || "";
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("GBP");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    try {
      setBusy(true);
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfq_id: params.id, token, supplier_email: email, company, price, currency, notes }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Quote submitted!");
      router.push(`/rfqs/${params.id}`);
    } catch (e: any) {
      alert(e.message || String(e));
    } finally { setBusy(false); }
  };

  if (!token) return <div className="card">Missing invite token.</div>;

  return (
    <div className="max-w-xl mx-auto card space-y-3">
      <h1 className="text-xl font-semibold">Submit Quote</h1>
      <div className="grid grid-cols-2 gap-3">
        <div><FormInput label="Contact email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><FormInput label="Company (optional)" value={company} onChange={e=>setCompany(e.target.value)} /></div>
        <div><FormInput label="Price" type="number" min={0} step="0.01" value={String(price)} onChange={e=>setPrice(Number(e.target.value))} /></div>
        <div>
          <label className="label">Currency</label>
          <select className="input" value={currency} onChange={e=>setCurrency(e.target.value)}>
            <option value="GBP">GBP</option><option value="EUR">EUR</option><option value="USD">USD</option>
          </select>
        </div>
        <div className="col-span-2"><FormTextarea label="Notes" rows={4} value={notes} onChange={e=>setNotes(e.target.value)} /></div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button onClick={submit} disabled={busy}>Submit Quote</Button>
      </div>
    </div>
  );
}
