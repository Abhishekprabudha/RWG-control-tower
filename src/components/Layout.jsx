import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Minimize2, Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import { useDemo } from '../context/DemoContext';

export default function Layout({ children, activePage, setActivePage }) {
  const { presentationMode, setPresentationMode, toast, eventBanner } = useDemo();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen navy-grid ${presentationMode ? 'presentation-mode' : ''}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} presentationMode={presentationMode} />
      <main className={`min-h-screen transition-all ${presentationMode ? 'ml-[92px]' : 'ml-[292px]'}`}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200"><Sparkles size={15} /> Live executive command center</div>
              <p className="mt-1 truncate text-sm text-slate-300">{eventBanner}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white">{clock.toLocaleDateString()} · {clock.toLocaleTimeString()}</div>
              <button onClick={() => setPresentationMode(!presentationMode)} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 hover:bg-amber-300/20">
                {presentationMode ? <Minimize2 size={16} className="mr-2 inline" /> : <Maximize2 size={16} className="mr-2 inline" />}
                {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
              </button>
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }} className="page-shell p-6">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 30, x: 30 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-[60] max-w-md rounded-3xl border border-amber-300/30 bg-slate-950/95 p-4 shadow-2xl backdrop-blur"><p className="font-bold text-amber-100">{toast}</p></motion.div>}
      </AnimatePresence>
    </div>
  );
}
