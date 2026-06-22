import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2 } from 'lucide-react';
import { formatRM } from '../utils/calculations';

export default function AgentFeed({ actions = [], compact = false }) {
  const visible = [...actions].slice(0, compact ? 5 : 8);
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Live Agent Activity</p>
          <h3 className="text-xl font-black text-white">AI agents acting across the mountain</h3>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">Live</span>
      </div>
      <div className="thin-scrollbar max-h-[440px] space-y-3 overflow-auto pr-1">
        <AnimatePresence initial={false}>
          {visible.map((item, index) => (
            <motion.div
              layout
              key={item.action_id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-2 text-amber-200"><Bot size={18} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-white">{item.agent_name}</p>
                    <span className="text-xs text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/5 px-2 py-1 text-slate-300">{item.action_type}</span>
                    <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-emerald-200"><CheckCircle2 size={12} className="mr-1 inline" />{item.confidence}% confidence</span>
                    <span className="rounded-full bg-amber-300/10 px-2 py-1 text-amber-200">{formatRM(item.value_impact_rm)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
