import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, FerrisWheel, Megaphone, Users } from 'lucide-react';
import ForecastChart from '../components/ForecastChart';
import MetricCard from '../components/MetricCard';
import RiskBadge from '../components/RiskBadge';
import { useDemo } from '../context/DemoContext';

export default function DemandSimulator() {
  const { runScenario, activeScenario, notify } = useDemo();
  const [occupancy, setOccupancy] = useState(92);
  const [footfall, setFootfall] = useState('high');
  const [event, setEvent] = useState('Concert');
  const [weather, setWeather] = useState('Rain');
  const [themePark, setThemePark] = useState(true);
  const [retail, setRetail] = useState(true);
  const [simulated, setSimulated] = useState(false);

  const multiplier = useMemo(() => {
    const foot = footfall === 'extreme' ? 1.18 : footfall === 'high' ? 1.1 : 1;
    const weatherFactor = weather === 'Heavy Rain' ? 1.09 : weather === 'Rain' ? 1.04 : 1;
    return Number((occupancy / 92 * foot * weatherFactor * (themePark ? 1.03 : 1) * (retail ? 1.04 : 1)).toFixed(2));
  }, [occupancy, footfall, weather, themePark, retail]);

  const chartData = ['Now','+2h','+4h','+6h','+8h','+12h'].map((time, idx) => ({ time, baseline: 100 + idx * 4, shock: Math.round((100 + idx * 11) * multiplier) }));
  const impacts = [
    ['F&B demand', 38], ['Bottled drinks', 44], ['Frozen food', 29], ['Merchandise', 31], ['Receiving gate load', 26], ['Linen demand', 18]
  ].map(([label, value]) => ({ label, value: Math.round(value * multiplier) }));

  const simulate = () => {
    setSimulated(true);
    if (event === 'Concert') runScenario('concert');
    else if (weather === 'Heavy Rain' || weather === 'Rain') runScenario('rain');
    else if (retail) runScenario('viral');
    notify('Demand shock simulation activated');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">Demand Shock Simulator</p><h1 className="mt-2 text-4xl font-black text-white">Create a live mountain business shock</h1><p className="mt-3 max-w-4xl text-slate-300">Move one parameter and watch AI agents activate across procurement, warehouse, receiving gate and retail.</p></div>
      <div className="grid grid-cols-[420px_1fr] gap-6">
        <section className="glass-panel rounded-3xl p-6">
          <h3 className="text-2xl font-black text-white">Simulation controls</h3>
          <div className="mt-6 space-y-6">
            <label className="block"><span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-300"><span>Hotel occupancy</span><span>{occupancy}%</span></span><input type="range" min="60" max="100" value={occupancy} onChange={e => setOccupancy(Number(e.target.value))} className="w-full accent-amber-300" /></label>
            <label className="block"><span className="mb-2 text-sm font-bold text-slate-300">Footfall</span><select value={footfall} onChange={e => setFootfall(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"><option>normal</option><option>high</option><option>extreme</option></select></label>
            <label className="block"><span className="mb-2 text-sm font-bold text-slate-300">Event selector</span><select value={event} onChange={e => setEvent(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"><option>Concert</option><option>School Holiday</option><option>CNY</option><option>Hari Raya</option><option>Long Weekend</option><option>Rainy Day</option></select></label>
            <label className="block"><span className="mb-2 text-sm font-bold text-slate-300">Weather</span><select value={weather} onChange={e => setWeather(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"><option>Clear</option><option>Rain</option><option>Heavy Rain</option></select></label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setThemePark(!themePark)} className={`rounded-2xl border p-3 text-sm font-bold ${themePark ? 'border-amber-300/40 bg-amber-300/15 text-amber-100' : 'border-white/10 bg-white/[0.04] text-slate-300'}`}><FerrisWheel size={16} className="mr-2 inline" />Theme park</button>
              <button onClick={() => setRetail(!retail)} className={`rounded-2xl border p-3 text-sm font-bold ${retail ? 'border-amber-300/40 bg-amber-300/15 text-amber-100' : 'border-white/10 bg-white/[0.04] text-slate-300'}`}><Megaphone size={16} className="mr-2 inline" />Retail campaign</button>
            </div>
            <button onClick={simulate} className="gold-button w-full rounded-2xl px-5 py-4 font-black"><CloudRain size={18} className="mr-2 inline" />Simulate Demand Shock</button>
          </div>
        </section>
        <section className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <MetricCard title="Occupancy" value={occupancy} suffix="%" icon={Users} risk="amber" />
            <MetricCard title="Shock multiplier" value={Math.round(multiplier * 100)} suffix=" index" icon={Megaphone} risk="red" />
            <MetricCard title="Scenario active" value={simulated ? 1 : 0} suffix={simulated ? ' live' : ' idle'} icon={CloudRain} risk={simulated ? 'green' : 'neutral'} />
          </div>
          <div className="glass-panel rounded-3xl p-6"><div className="mb-3 flex items-center justify-between"><h3 className="text-2xl font-black text-white">Forecast shock curve</h3><RiskBadge risk={simulated ? 'Red' : 'Amber'} /></div><ForecastChart data={chartData} /></div>
          <div className="grid grid-cols-3 gap-4">
            {impacts.map((impact, index) => <motion.div key={impact.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 card-glow"><p className="text-sm text-slate-400">{impact.label}</p><p className="mt-2 text-3xl font-black text-white">+{impact.value}%</p><div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-300" style={{ width: `${Math.min(100, impact.value)}%` }} /></div></motion.div>)}
          </div>
          <div className="glass-panel rounded-3xl p-6"><h3 className="text-xl font-black text-white">Activated agents + recommended timeline</h3><div className="mt-4 grid grid-cols-4 gap-3">{['Demand Agent','Procurement Agent','Receiving Agent','Inventory Agent','Retail Agent','Supplier Agent','GenBI Agent','Route Agent'].map((agent, i) => <div key={agent} className={`rounded-2xl border p-3 ${simulated || i < 3 ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/[0.03] text-slate-400'}`}>{agent}</div>)}</div><div className="mt-5 space-y-2 text-sm text-slate-300">{['T+0 min: Detect demand shock and generate exception forecast','T+5 min: Recommend POs and inventory transfers','T+15 min: Reserve receiving slots and cold-chain route','T+30 min: Push executive action log to Control Tower'].map(t => <p key={t} className="rounded-2xl bg-white/[0.04] px-4 py-3">{t}</p>)}</div></div>
        </section>
      </div>
    </div>
  );
}
