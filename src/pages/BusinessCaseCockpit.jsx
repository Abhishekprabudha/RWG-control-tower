import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, Clock, PackageCheck, ShieldCheck } from 'lucide-react';
import BusinessCaseCard from '../components/BusinessCaseCard';
import MetricCard from '../components/MetricCard';
import { useDemo } from '../context/DemoContext';
import { formatRM, sumBusinessValue } from '../utils/calculations';

export default function BusinessCaseCockpit() {
  const { data, notify } = useDemo();
  const [roi, setRoi] = useState(false);
  const total = sumBusinessValue(data.businessCase);
  const categories = ['Working Capital','Process Productivity','Commercial Control','Revenue & Service'];
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">Business Case Cockpit</p><h1 className="mt-2 text-4xl font-black text-white">Quantified impact from agentic operations</h1><p className="mt-3 max-w-4xl text-slate-300">Executive cockpit for value pools: working capital, productivity, commercial control, revenue protection and guest-impact risk.</p></div>
      <div className="grid grid-cols-4 gap-4"><MetricCard title="Inventory excess reduced" value={14} suffix="%" icon={PackageCheck} risk="green" /><MetricCard title="GRN hours avoided" value={180} suffix=" hrs" icon={Clock} risk="green" /><MetricCard title="Commercial control" value={845} prefix="RM " suffix="K" icon={ShieldCheck} risk="green" /><MetricCard title="Total value signals" value={Math.round(total / 1000000 * 10) / 10} prefix="RM " suffix="M" icon={CircleDollarSign} risk="green" /></div>
      <div className="grid grid-cols-4 gap-4">{categories.map(category => <div key={category} className="glass-panel rounded-3xl p-5"><p className="text-xs uppercase tracking-[0.22em] text-amber-200">{category}</p><div className="mt-4 space-y-3">{data.businessCase.filter(i => i.category === category).map(item => <div key={item.metric_id} className="rounded-2xl bg-white/[0.04] p-3"><p className="font-bold text-white">{item.metric_name}</p><p className="mt-1 text-sm text-slate-400">{item.improvement} · {formatRM(item.value_rm)}</p></div>)}</div></div>)}</div>
      <div className="grid grid-cols-4 gap-4">{data.businessCase.map(item => <BusinessCaseCard key={item.metric_id} item={item} />)}</div>
      <div className="glass-panel rounded-3xl p-6 text-center"><button onClick={() => { setRoi(true); notify('ROI calculation completed'); }} className="gold-button rounded-2xl px-8 py-4 text-lg font-black">Run ROI Calculation</button>{roi && <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-6 max-w-3xl rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-6"><p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Estimated 12-week pilot value</p><p className="mt-2 text-5xl font-black text-white">RM 1.8M to RM 3.2M</p><p className="mt-3 text-slate-300">Indicative synthetic demo value for discussion only.</p></motion.div>}</div>
    </div>
  );
}
