import { useState } from 'react';
import { FileText, HandCoins, Search, ShieldAlert } from 'lucide-react';
import SupplierCard from '../components/SupplierCard';
import ActionModal from '../components/ActionModal';
import MetricCard from '../components/MetricCard';
import { useDemo } from '../context/DemoContext';
import { formatRM } from '../utils/calculations';

export default function SupplierIntelligence() {
  const { data, notify, addAgentAction } = useDemo();
  const [briefSupplier, setBriefSupplier] = useState(null);
  const contract = briefSupplier ? data.contracts.find(c => c.supplier_id === briefSupplier.supplier_id) : null;

  const openBrief = (supplier) => {
    setBriefSupplier(supplier);
    addAgentAction({ agent_name: 'Supplier Agent', action_type: 'Negotiation Brief', description: `Generated negotiation brief for ${supplier.supplier_name}.`, value_impact_rm: 38000, confidence: 91, status: 'Brief Ready' });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">Supplier & Contract Intelligence Agent</p><h1 className="mt-2 text-4xl font-black text-white">Buyer co-pilot for vendor intelligence</h1><p className="mt-3 max-w-4xl text-slate-300">Contract renewal alerts, maverick spend detection, duplicate category spend, consolidation opportunities and price benchmarks.</p></div>
      <div className="grid grid-cols-4 gap-4"><MetricCard title="Renewals under 90 days" value={data.contracts.filter(c => c.renewal_days_left <= 90).length} icon={FileText} risk="amber" /><MetricCard title="High-risk suppliers" value={data.suppliers.filter(s => s.risk_score > 50).length} icon={ShieldAlert} risk="red" /><MetricCard title="Benchmark variance max" value={15} suffix="%" icon={Search} risk="red" /><MetricCard title="Savings opportunity" value={680} prefix="RM " suffix="K" icon={HandCoins} risk="green" /></div>
      <div className="grid grid-cols-4 gap-4">{data.suppliers.map(supplier => <SupplierCard key={supplier.supplier_id} supplier={supplier} onBrief={openBrief} />)}</div>
      <div className="glass-panel rounded-3xl p-6"><h3 className="text-2xl font-black text-white">Buyer co-pilot actions</h3><div className="mt-4 grid grid-cols-4 gap-3"><button onClick={() => notify('Consolidation opportunity found: beverages + hotel dry goods volume bundling')} className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 font-bold text-amber-100">Find Consolidation Opportunity</button><button onClick={() => notify('Renewal risks: IT Hardware, Hotel Linen, Maintenance Spares')} className="rounded-2xl border border-red-300/25 bg-red-300/10 px-4 py-3 font-bold text-red-100">Show Renewal Risks</button><button onClick={() => notify('Price benchmark: M&E Ride Parts Asia is 12% above market index')} className="rounded-2xl border border-sky-300/25 bg-sky-300/10 px-4 py-3 font-bold text-sky-100">Benchmark Supplier Price</button><button onClick={() => openBrief(data.suppliers[4])} className="gold-button rounded-2xl px-4 py-3 font-black">Generate Negotiation Brief</button></div></div>
      <ActionModal open={!!briefSupplier} title={`Negotiation brief: ${briefSupplier?.supplier_name}`} onClose={() => setBriefSupplier(null)}>
        {briefSupplier && <div className="grid grid-cols-[1fr_1fr] gap-5 text-slate-200"><div className="space-y-3"><p className="rounded-2xl bg-white/[0.04] p-4"><b className="text-white">Category:</b> {briefSupplier.category}</p><p className="rounded-2xl bg-white/[0.04] p-4"><b className="text-white">Current supplier price index:</b> {briefSupplier.price_index}</p><p className="rounded-2xl bg-white/[0.04] p-4"><b className="text-white">Market benchmark variance:</b> {contract?.price_benchmark_variance}%</p><p className="rounded-2xl bg-white/[0.04] p-4"><b className="text-white">Spend volume:</b> {formatRM(contract?.contract_value_rm)}</p></div><div className="space-y-3"><p className="rounded-2xl bg-white/[0.04] p-4"><b className="text-white">SLA history:</b> {briefSupplier.sla_score}% SLA / {briefSupplier.delivery_reliability}% reliability</p><p className="rounded-2xl bg-amber-300/10 p-4 text-amber-100"><b>Recommended negotiation position:</b> Price reset to benchmark, service credits for missed SLA, and committed mountain surge slots.</p><p className="rounded-2xl bg-emerald-300/10 p-4 text-emerald-100"><b>Expected savings:</b> {formatRM(Math.round((contract?.contract_value_rm || 1000000) * 0.045))}</p><p className="rounded-2xl bg-sky-300/10 p-4 text-sky-100"><b>Risk notes:</b> {contract?.risk_notes}</p></div></div>}
      </ActionModal>
    </div>
  );
}
