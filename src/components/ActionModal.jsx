import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ActionModal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }} className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-3xl border border-amber-300/20 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-white">{title}</h3>
              <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"><X size={20} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
