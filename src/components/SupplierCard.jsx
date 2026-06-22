import { ShieldCheck, TrendingDown } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function SupplierCard({ supplier, onBrief }) {
  const risk = supplier.risk_score > 55 ? 'Red' : supplier.risk_score > 35 ? 'Amber' : 'Green';
  return (
    <div className="card-glow rounded-3xl border border-white/10 bg-slate-950/45 p-5 transition hover:border-amber-300/35">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white">{supplier.supplier_name}</h3>
          <p className="mt-1 text-sm text-slate-400">{supplier.category}</p>
        </div>
        <RiskBadge risk={risk} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-white/[0.04] p-3"><p className="text-xs text-slate-400">SLA</p><p className="text-xl font-black text-white">{supplier.sla_score}%</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-3"><p className="text-xs text-slate-400">Reliability</p><p className="text-xl font-black text-white">{supplier.delivery_reliability}%</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-3"><p className="text-xs text-slate-400">Price</p><p className="text-xl font-black text-white">{supplier.price_index}</p></div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p><ShieldCheck size={15} className="mr-2 inline text-emerald-300" />{supplier.compliance_status}</p>
        <p><TrendingDown size={15} className="mr-2 inline text-amber-200" />Renewal: {supplier.renewal_date}</p>
      </div>
      <button onClick={() => onBrief?.(supplier)} className="mt-5 w-full rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100 hover:bg-amber-300/20">Generate Negotiation Brief</button>
    </div>
  );
}
