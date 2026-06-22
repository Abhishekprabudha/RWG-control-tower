import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Clipboard, Download, Send, Sparkles } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { askGenBI, getBusinessCaseSummary } from '../utils/genbiEngine';
import { exportToCsv, exportToJson } from '../utils/calculations';
import { useDemo } from '../context/DemoContext';

const chips = [
  'What items are at highest stockout risk today?',
  'Which supplier has the worst SLA?',
  'Which F&B item should we reorder first?',
  'What is the value of avoided stockouts?',
  'Which merchandise SKU is selling fastest?',
  'Which contracts expire in the next 90 days?',
  'Where can we reduce maverick spend?',
  'What did the receiving gate detect today?',
  'Which pilot should RWG start with?',
  'Show me the business case for AI Receiving Gate.',
  'Why did the AI recommend this PO?',
  'Which store needs inventory transfer now?'
];

function ResultTable({ rows = [] }) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-xs">
        <thead className="bg-white/[0.04] text-slate-400"><tr>{headers.map(h => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-white/10">{rows.map((row, i) => <tr key={i}>{headers.map(h => <td key={h} className="px-3 py-2 text-slate-200">{row[h]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function MiniChart({ data }) {
  if (!data?.length) return null;
  return (
    <div className="mt-4 h-44 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="hour" stroke="rgba(226,232,240,.65)" tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(226,232,240,.65)" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(248,201,76,.2)', borderRadius: 12 }} />
          <Area type="monotone" dataKey="velocity" stroke="#f8c94c" fill="rgba(248,201,76,.18)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function GenBIChat({ embedded = false }) {
  const { data, notify } = useDemo();
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask AIONOS GenBI about RWG procurement, inventory, suppliers, receiving, retail, contracts, pilot roadmap or business case.', result: null }
  ]);

  const contextPayload = useMemo(() => data, [data]);

  const submit = (question = input) => {
    if (!question.trim() || thinking) return;
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const result = askGenBI(question, contextPayload);
      setMessages(prev => [...prev, { role: 'assistant', content: result.answer, result }]);
      setThinking(false);
    }, 850);
  };

  const generateSummary = () => {
    const result = getBusinessCaseSummary(contextPayload);
    setMessages(prev => [...prev, { role: 'assistant', content: `Executive summary: ${result.answer}`, result }]);
  };

  const copyLatest = async () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    await navigator.clipboard.writeText(last?.content || '');
    notify?.('Copied GenBI answer to clipboard');
  };

  const downloadLog = () => {
    exportToJson(data.agentActions, 'aionos-rwg-action-log.json');
    exportToCsv(data.agentActions, 'aionos-rwg-action-log.csv');
    notify?.('Downloaded AI action log as JSON and CSV');
  };

  return (
    <div className={`glass-panel flex ${embedded ? 'h-[640px]' : 'h-[760px]'} flex-col rounded-3xl p-5`}>
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-200"><Bot size={24} /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Ask AIONOS GenBI</p>
            <h3 className="text-2xl font-black text-white">Conversational command intelligence</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generateSummary} className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-sm font-bold text-amber-100 hover:bg-amber-300/20"><Sparkles size={16} className="mr-2 inline" />Generate Executive Summary</button>
          <button onClick={downloadLog} className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 hover:border-amber-300/30"><Download size={16} className="mr-2 inline" />Action Log</button>
          <button onClick={copyLatest} className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 hover:border-amber-300/30"><Clipboard size={16} /></button>
        </div>
      </div>
      <div className="thin-scrollbar flex-1 space-y-4 overflow-auto py-5 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-3xl border p-4 ${message.role === 'user' ? 'border-amber-300/30 bg-amber-300/15 text-amber-50' : 'border-white/10 bg-slate-950/60 text-slate-200'}`}>
                <p className="leading-relaxed">{message.content}</p>
                {message.result && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-sm text-slate-300"><span className="font-bold text-amber-100">Recommended action:</span> {message.result.action}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-emerald-200">{message.result.confidence}% confidence</span>
                      <span className="rounded-full bg-sky-300/10 px-2 py-1 text-sky-200">Source: {message.result.source}</span>
                    </div>
                    <MiniChart data={message.result.chart} />
                    <ResultTable rows={message.result.table} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300"><span className="shimmer rounded-full px-4 py-2 text-sm">Agent is thinking…</span></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {chips.slice(0, embedded ? 6 : 12).map(chip => <button key={chip} onClick={() => submit(chip)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:border-amber-300/30 hover:text-amber-100">{chip}</button>)}
      </div>
      <div className="flex gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Ask anything about RWG procurement, suppliers, inventory, receiving, retail or business case…" className="flex-1 bg-transparent px-4 text-white outline-none placeholder:text-slate-500" />
        <button onClick={() => submit()} className="gold-button rounded-2xl px-5 py-3 font-black"><Send size={18} /></button>
      </div>
    </div>
  );
}
