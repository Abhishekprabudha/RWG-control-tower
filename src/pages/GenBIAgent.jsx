import GenBIChat from '../components/GenBIChat';

export default function GenBIAgent() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">GenBI Agent / Ask AIONOS</p><h1 className="mt-2 text-4xl font-black text-white">Ask business questions using local JSON data</h1><p className="mt-3 max-w-4xl text-slate-300">No backend. No LLM API. The front-end simulates deterministic business intelligence with keyword matching, JSON retrieval and executive answer templates.</p></div>
      <GenBIChat />
    </div>
  );
}
