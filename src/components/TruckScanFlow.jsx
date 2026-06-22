import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Thermometer, Truck, ScanLine, PackageCheck } from 'lucide-react';

const stages = [
  'Truck ID captured',
  'Manifest scanned',
  'PO matched',
  'SKU count verified',
  'Seal integrity checked',
  'Cold chain temperature validated',
  'Damage detected',
  'Auto-GRN created',
  'Putaway route assigned'
];

export default function TruckScanFlow({ truck, running, onComplete }) {
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (!running) return;
    setActiveStage(-1);
    let idx = -1;
    const interval = setInterval(() => {
      idx += 1;
      setActiveStage(idx);
      if (idx >= stages.length - 1) {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 500);
      }
    }, 620);
    return () => clearInterval(interval);
  }, [running, onComplete]);

  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="relative h-28 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-4">
        <div className="absolute bottom-6 left-4 right-4 h-1 rounded-full bg-white/10" />
        <div className="absolute bottom-6 left-4 h-1 rounded-full bg-gradient-to-r from-amber-300 to-sky-300 transition-all duration-700" style={{ width: `${Math.max(10, (activeStage + 1) / stages.length * 92)}%` }} />
        <motion.div className="absolute bottom-8 left-0 flex items-center gap-2 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-amber-100 shadow-2xl" animate={{ x: running ? [0, 630] : 0 }} transition={{ duration: 5.2, ease: 'easeInOut' }}>
          <Truck size={26} /> <span className="font-black">{truck?.truck_id || 'RWG-IN-4821'}</span>
        </motion.div>
        <div className="absolute right-4 top-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-200"><ScanLine size={16} className="mr-2 inline" />AI Intake Lane</div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stages.map((stage, index) => {
          const done = activeStage >= index;
          const isActive = activeStage === index;
          return (
            <div key={stage} className={`rounded-2xl border p-3 transition ${done ? 'border-emerald-300/30 bg-emerald-300/10' : isActive ? 'border-amber-300/40 bg-amber-300/10' : 'border-white/10 bg-white/[0.03]'}`}>
              <div className="flex items-center gap-2">
                <span className={`${done ? 'text-emerald-200' : 'text-slate-500'}`}>{done ? <CheckCircle2 size={16} /> : <span className="block h-4 w-4 rounded-full border border-white/20" />}</span>
                <p className="text-sm font-semibold text-white">{stage}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400">Supplier</p><p className="mt-1 font-bold text-white">Genting Fresh Foods</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400">PO</p><p className="mt-1 font-bold text-white">{truck?.po_id}</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400"><Thermometer size={14} className="mr-1 inline" />Temperature</p><p className="mt-1 font-bold text-white">{truck?.temperature}°C</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-slate-400"><PackageCheck size={14} className="mr-1 inline" />Exception</p><p className="mt-1 font-bold text-amber-200">{truck?.damage_detected}</p></div>
      </div>
    </div>
  );
}
