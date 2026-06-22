import { ArrowRightLeft, Route, Snowflake, TrendingUp } from 'lucide-react';
import AnimatedRouteMap from '../components/AnimatedRouteMap';
import MetricCard from '../components/MetricCard';
import { useDemo } from '../context/DemoContext';

export default function InventoryBalancing() {
  const { data, approveTransfer, notify, routePulse } = useDemo();
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">Mountain Inventory Balancing Agent</p><h1 className="mt-2 text-4xl font-black text-white">Move inventory before guests feel the shortage</h1><p className="mt-3 max-w-4xl text-slate-300">The agent reads demand, location stock, weather and route constraints, then recommends cross-vertical transfers.</p></div>
      <div className="grid grid-cols-4 gap-4"><MetricCard title="Transfer opportunities" value={5} icon={ArrowRightLeft} risk="green" /><MetricCard title="Cold-chain priority" value={2} suffix=" routes" icon={Snowflake} risk="amber" /><MetricCard title="Route optimisation" value={18} suffix="%" icon={Route} risk="green" /><MetricCard title="Service impact avoided" value={94} suffix="%" icon={TrendingUp} risk="green" /></div>
      <div className="grid grid-cols-[1fr_520px] gap-6">
        <AnimatedRouteMap zones={data.resortZones} pulse={routePulse} onNodeClick={(zone) => notify(`${zone.zone_name}: ${zone.current_status}`)} />
        <section className="glass-panel rounded-3xl p-6">
          <h3 className="text-2xl font-black text-white">AI recommendations</h3>
          <div className="thin-scrollbar mt-5 max-h-[560px] space-y-3 overflow-auto pr-1">
            {data.warehouseInventory.map(item => (
              <div key={item.sku_id} className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <div className="flex items-start justify-between gap-3"><div><h4 className="font-black text-white">{item.sku_name}</h4><p className="mt-1 text-sm text-slate-400">{item.location} · Qty {item.quantity.toLocaleString()}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.quantity < item.min_required ? 'bg-red-300/10 text-red-100' : 'bg-emerald-300/10 text-emerald-100'}`}>{item.quantity < item.min_required ? 'Below min' : 'Healthy'}</span></div>
                <p className="mt-3 rounded-2xl bg-amber-300/10 p-3 text-sm text-amber-100">{item.recommended_action}</p>
                <div className="mt-3 flex gap-2"><button onClick={() => approveTransfer(item)} className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100">Approve Transfer</button><button onClick={() => notify(`Optimised route for ${item.sku_name}`)} className="rounded-2xl border border-sky-300/25 bg-sky-300/10 px-3 py-2 text-sm font-bold text-sky-100">Optimise Route</button><button onClick={() => notify(`Impact: ${item.sku_name} service risk reduced by 72%`)} className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200">Show Impact</button></div>
              </div>
            ))}
          </div>
          <button onClick={() => notify('Cold-chain prioritisation applied to banquet kitchen frozen goods before 6 PM')} className="gold-button mt-5 w-full rounded-2xl px-5 py-4 font-black">Prioritise Cold Chain</button>
        </section>
      </div>
    </div>
  );
}
