import { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, PackagePlus, XCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import ForecastChart from '../components/ForecastChart';
import ActionModal from '../components/ActionModal';
import RiskBadge from '../components/RiskBadge';
import { useDemo } from '../context/DemoContext';
import { buildForecastRows, formatRM } from '../utils/calculations';
import { getRecommendedReorder } from '../utils/genbiEngine';

export default function FNBProcurementAgent() {
  const { data, approvePO, notify } = useDemo();
  const [selected, setSelected] = useState(data.fnbInventory[2]);
  const [genbiOpen, setGenbiOpen] = useState(false);
  const genbi = useMemo(() => getRecommendedReorder(data, selected?.item_name), [data, selected]);

  const columns = [
    { key: 'item_name', label: 'Item' },
    { key: 'current_stock', label: 'Current Stock', render: r => `${r.current_stock.toLocaleString()} ${r.unit}` },
    { key: 'predicted_demand', label: 'Predicted Demand', render: r => r.predicted_demand.toLocaleString() },
    { key: 'days_cover', label: 'Days Cover', render: r => `${r.days_cover} days` },
    { key: 'risk_level', label: 'Risk', type: 'risk' },
    { key: 'preferred_supplier', label: 'Preferred Supplier' },
    { key: 'contract_price', label: 'Contract Price', render: r => `RM ${r.contract_price}` },
    { key: 'sla', label: 'SLA', render: r => `${r.sla}%` },
    { key: 'compliance_status', label: 'Compliance' },
    { key: 'po_status', label: 'AI Action' }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">F&B Procurement Agent</p><h1 className="mt-2 text-4xl font-black text-white">Autonomous demand-aware procurement planning</h1><p className="mt-3 max-w-4xl text-slate-300">The agent converts event demand, days of cover, contract price and supplier SLA into PO recommendations.</p></div>
      <div className="grid grid-cols-[1.35fr_.85fr] gap-6">
        <section className="glass-panel rounded-3xl p-5"><DataTable columns={columns} rows={data.fnbInventory} onRowClick={setSelected} selectedId={selected?.item_id} /></section>
        <section className="glass-panel rounded-3xl p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.24em] text-amber-200">Item detail</p><h2 className="mt-2 text-3xl font-black text-white">{selected.item_name}</h2></div><RiskBadge risk={selected.risk_level} /></div>
          <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-4"><p className="mb-3 text-sm font-bold text-slate-300">Demand forecast vs event-adjusted forecast</p><ForecastChart data={buildForecastRows(selected)} height={230} /></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400">Recommended PO</p><p className="mt-1 text-2xl font-black text-white">{selected.recommended_po_qty.toLocaleString()} {selected.unit}</p></div>
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400">Contracted value</p><p className="mt-1 text-2xl font-black text-white">{formatRM(selected.recommended_po_qty * selected.contract_price)}</p></div>
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400">Waste reduction</p><p className="mt-1 text-2xl font-black text-emerald-200">{selected.waste_reduction}%</p></div>
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400">Stockout avoidance</p><p className="mt-1 text-2xl font-black text-emerald-200">{selected.stockout_avoidance}%</p></div>
          </div>
          <div className="mt-5 rounded-3xl border border-amber-300/15 bg-amber-300/10 p-4"><p className="font-bold text-amber-100">Supplier comparison</p><div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-300"><span>{selected.preferred_supplier}</span><span>SLA {selected.sla}%</span><span>RM {selected.contract_price}/unit</span></div></div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button onClick={() => approvePO(selected)} className="gold-button rounded-2xl px-4 py-3 font-black"><CheckCircle2 size={17} className="mr-2 inline" />Approve AI PO</button>
            <button onClick={() => notify(`Rejected PO recommendation for ${selected.item_name}`)} className="rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 font-bold text-red-100"><XCircle size={17} className="mr-2 inline" />Reject</button>
            <button onClick={() => setGenbiOpen(true)} className="rounded-2xl border border-sky-300/25 bg-sky-400/10 px-4 py-3 font-bold text-sky-100"><HelpCircle size={17} className="mr-2 inline" />Ask GenBI Why</button>
          </div>
        </section>
      </div>
      <ActionModal open={genbiOpen} title={`Why AI recommends ${selected.item_name}`} onClose={() => setGenbiOpen(false)}>
        <p className="text-lg text-slate-200">{genbi.answer}</p><p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-100"><b>Recommended action:</b> {genbi.action}</p><p className="mt-4 text-sm text-slate-400">Source: {genbi.source} · Confidence {genbi.confidence}%</p>
      </ActionModal>
    </div>
  );
}
