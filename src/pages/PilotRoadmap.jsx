import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, Target } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

const phases = [
  { title: '0–2 Weeks: Discovery', items: ['Map pain points','Confirm data feeds','Define pilot KPIs','Select pilot zone'] },
  { title: '3–6 Weeks: Pilot', items: ['Deploy one live agent','Measure value','Tune guardrails','Show executive cockpit'] },
  { title: '7–12 Weeks: Scale Plan', items: ['Industrialise integrations','Expand to more verticals','Launch AI Control Tower','Prioritise next agents'] }
];
const options = [
  { option: 'Option A', title: 'F&B Demand + PO Agent', best: 'Best for CFO/procurement value.', value: 'Fast savings + stockout avoidance' },
  { option: 'Option B', title: 'AI Receiving Gate', best: 'Best for operational wow.', value: 'Visible process transformation' },
  { option: 'Option C', title: 'Supplier Intelligence + Buyer Co-Pilot', best: 'Best for procurement leadership.', value: 'Commercial control + negotiation leverage' }
];

export default function PilotRoadmap() {
  const { notify } = useDemo();
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">Pilot Roadmap</p><h1 className="mt-2 text-4xl font-black text-white">Start visible. Prove value in weeks. Scale the mountain.</h1><p className="mt-3 max-w-4xl text-slate-300">A pragmatic path to close the deal with one client-visible pilot and a clear 12-week value narrative.</p></div>
      <div className="grid grid-cols-3 gap-6">{phases.map((phase, index) => <motion.div key={phase.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }} className="glass-panel rounded-3xl p-6"><div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-300/10 p-3 text-amber-200"><Rocket size={22} /></div><h3 className="text-2xl font-black text-white">{phase.title}</h3></div><div className="mt-6 space-y-3">{phase.items.map(item => <p key={item} className="rounded-2xl bg-white/[0.04] p-3 text-slate-200"><CheckCircle2 size={16} className="mr-2 inline text-emerald-300" />{item}</p>)}</div></motion.div>)}</div>
      <div className="glass-panel rounded-3xl p-6"><h2 className="text-3xl font-black text-white">Recommended pilot options</h2><div className="mt-5 grid grid-cols-3 gap-4">{options.map(opt => <div key={opt.option} className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 card-glow"><p className="text-xs uppercase tracking-[0.22em] text-amber-200">{opt.option}</p><h3 className="mt-2 text-2xl font-black text-white">{opt.title}</h3><p className="mt-3 text-slate-300">{opt.best}</p><p className="mt-4 rounded-2xl bg-emerald-300/10 p-3 text-sm font-bold text-emerald-100">{opt.value}</p><button onClick={() => notify(`${opt.title} selected for executive discussion`)} className="mt-5 w-full rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 font-bold text-amber-100 hover:bg-amber-300/20">Select pilot</button></div>)}</div></div>
      <div className="rounded-[2rem] border border-amber-300/25 bg-gradient-to-r from-amber-300/15 to-sky-300/10 p-8 text-center"><Target className="mx-auto text-amber-200" size={42} /><p className="mt-4 text-4xl font-black text-white">Start with one visible pilot. Prove value in weeks. Scale into one AI nervous system for the mountain.</p></div>
    </div>
  );
}
