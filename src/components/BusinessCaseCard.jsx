import { formatRM } from '../utils/calculations';

export default function BusinessCaseCard({ item }) {
  return (
    <div className="card-glow rounded-3xl border border-white/10 bg-slate-950/45 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200">{item.category}</p>
      <h3 className="mt-2 text-lg font-black text-white">{item.metric_name}</h3>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-black gold-text">{formatRM(item.value_rm)}</p>
          <p className="mt-1 text-sm text-slate-400">Pilot value signal</p>
        </div>
        <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-sm font-bold text-emerald-200">{item.improvement}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300" style={{ width: `${Math.min(95, 30 + (item.value_rm / 680000) * 65)}%` }} /></div>
    </div>
  );
}
