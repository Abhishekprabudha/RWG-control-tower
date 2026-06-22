import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ title, value, suffix = '', prefix = '', icon: Icon, risk = 'neutral', detail, delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const numericValue = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, '')) || 0;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 900;
    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplay(Math.round(numericValue * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numericValue]);

  const riskClasses = {
    red: 'from-red-500/15 to-red-500/5 border-red-400/25',
    amber: 'from-amber-500/15 to-amber-500/5 border-amber-400/25',
    green: 'from-emerald-500/15 to-emerald-500/5 border-emerald-400/25',
    neutral: 'from-slate-800/80 to-slate-900/70 border-white/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className={`metric-card card-glow rounded-2xl border bg-gradient-to-br p-4 ${riskClasses[risk] || riskClasses.neutral}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{prefix}{display.toLocaleString()}</span>
            {suffix && <span className="text-sm font-semibold text-slate-300">{suffix}</span>}
          </div>
        </div>
        {Icon && <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2 text-amber-200"><Icon size={22} /></div>}
      </div>
      {detail && <p className="mt-3 text-sm text-slate-300">{detail}</p>}
    </motion.div>
  );
}
