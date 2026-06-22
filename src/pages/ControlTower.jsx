import { AlertTriangle, Boxes, CircleDollarSign, Clock3, PackageX, ShieldAlert, Sparkles } from 'lucide-react';
import AnimatedRouteMap from '../components/AnimatedRouteMap';
import AgentFeed from '../components/AgentFeed';
import MetricCard from '../components/MetricCard';
import RiskBadge from '../components/RiskBadge';
import ScenarioButton from '../components/ScenarioButton';
import { useDemo } from '../context/DemoContext';
import { scenarioDefinitions } from '../utils/scenarioEngine';

export default function ControlTower() {
  const { data, kpis, runScenario, activeScenario, routePulse, notify } = useDemo();
  const redZones = data.resortZones.filter(z => z.risk_level === 'Red').length;
  const amberZones = data.resortZones.filter(z => z.risk_level === 'Amber').length;

  return (
    <div className="space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[2rem] p-7">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">AIONOS × RESORTS WORLD GENTING</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-white">Mountain AI Control Tower</h1>
            <p className="mt-3 max-w-3xl text-lg text-slate-300">Turn mountain-top operational complexity into a real-time advantage — across procurement, supply chain, warehousing and retail.</p>
          </div>
          <button onClick={() => runScenario('concert')} className="gold-button rounded-2xl px-6 py-4 text-base font-black"><Sparkles size={18} className="mr-2 inline" />Run Live Demo Scenario</button>
        </div>
      </section>

      <section className="grid grid-cols-6 gap-4">
        <MetricCard title="Stockout Risk" value={kpis.stockoutRisk} suffix="%" icon={PackageX} risk={kpis.stockoutRisk > 75 ? 'red' : 'amber'} detail="F&B + retail at-risk today" />
        <MetricCard title="Gate Congestion" value={kpis.gateCongestion} suffix="%" icon={Clock3} risk={kpis.gateCongestion > 80 ? 'red' : 'amber'} detail="Inbound load vs capacity" delay={0.05} />
        <MetricCard title="Supplier SLA Risk" value={kpis.supplierSla} suffix="%" icon={ShieldAlert} risk="amber" detail="Renewal + reliability exposure" delay={0.1} />
        <MetricCard title="Inventory at Risk" value={kpis.inventoryAtRisk} prefix="RM " suffix="M" icon={Boxes} risk="amber" detail="Working capital exposure" delay={0.15} />
        <MetricCard title="Retail Opportunity" value={kpis.retailOpportunity} prefix="RM " suffix="M" icon={CircleDollarSign} risk="green" detail="Revenue protected today" delay={0.2} />
        <MetricCard title="AI Actions Today" value={kpis.aiActions} icon={Sparkles} risk="green" detail="Recommendations created" delay={0.25} />
      </section>

      <section className="grid grid-cols-[1fr_420px] gap-6">
        <div className="space-y-6">
          <AnimatedRouteMap zones={data.resortZones} pulse={routePulse} onNodeClick={(zone) => notify(`${zone.zone_name}: ${zone.current_status}`)} />
          <div className="grid grid-cols-4 gap-4">
            {['Predict demand before stockouts','Convert receiving gate into AI intake','Rebalance inventory across the mountain','Turn retail velocity into automated action'].map((text, index) => (
              <div key={text} className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 card-glow">
                <p className="text-3xl font-black gold-text">0{index + 1}</p>
                <p className="mt-3 font-bold text-white">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black text-white">Risk Heatmap</h3><AlertTriangle className="text-amber-200" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-center"><p className="text-3xl font-black text-red-100">{redZones}</p><p className="text-xs text-red-200">Red zones</p></div>
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-center"><p className="text-3xl font-black text-amber-100">{amberZones}</p><p className="text-xs text-amber-200">Amber zones</p></div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-center"><p className="text-3xl font-black text-emerald-100">{data.resortZones.length - redZones - amberZones}</p><p className="text-xs text-emerald-200">Green zones</p></div>
            </div>
            <div className="mt-4 space-y-2">{data.resortZones.slice(0, 6).map(zone => <div key={zone.zone_id} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-2"><span className="text-sm text-slate-300">{zone.zone_name}</span><RiskBadge risk={zone.risk_level} /></div>)}</div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="text-xl font-black text-white">Pre-built scenarios</h3>
            <div className="mt-4 space-y-3">
              {Object.entries(scenarioDefinitions).map(([key, value]) => <ScenarioButton key={key} title={value.title} subtitle={value.subtitle} active={activeScenario === key} onClick={() => runScenario(key)} />)}
            </div>
          </div>
          <AgentFeed actions={data.agentActions} compact />
        </div>
      </section>
    </div>
  );
}
