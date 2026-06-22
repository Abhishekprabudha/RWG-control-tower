import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function ScenarioButton({ title, subtitle, onClick, active }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left transition ${active ? 'border-amber-300/60 bg-amber-300/15' : 'border-white/10 bg-white/[0.04] hover:border-amber-300/40 hover:bg-amber-300/10'}`}
    >
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-amber-300/15 p-2 text-amber-200"><Zap size={18} /></span>
        <div>
          <p className="font-bold text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
    </motion.button>
  );
}
