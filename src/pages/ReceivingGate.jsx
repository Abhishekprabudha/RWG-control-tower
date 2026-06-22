import { useState } from 'react';
import { AlertTriangle, CheckCircle2, FileCheck2, Route, ShieldAlert, Truck } from 'lucide-react';
import TruckScanFlow from '../components/TruckScanFlow';
import MetricCard from '../components/MetricCard';
import { useDemo } from '../context/DemoContext';
import { formatRM } from '../utils/calculations';

export default function ReceivingGate() {
  const { data, completeTruckScan, notify } = useDemo();
  const [running, setRunning] = useState(false);
  const truck = data.receivingTrucks[0];
  const startScan = () => { setRunning(true); notify('AI scan started for incoming truck'); };
  const finish = () => { completeTruckScan(truck); setRunning(false); };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-7"><p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-200">AI Receiving Gate / IntelliWarehouse</p><h1 className="mt-2 text-4xl font-black text-white">Turn the receiving gate into an AI intake lane</h1><p className="mt-3 max-w-4xl text-slate-300">The biggest visual wow: scan truck, match PO, validate cold chain, detect damage, create GRN and assign putaway route.</p></div>
      <div className="grid grid-cols-4 gap-4"><MetricCard title="Manual gate time reduced" value={62} suffix="%" icon={Truck} risk="green" /><MetricCard title="Inbound scan accuracy" value={98} suffix="%" icon={CheckCircle2} risk="green" /><MetricCard title="Putaway errors avoided" value={31} suffix=" cases" icon={Route} risk="amber" /><MetricCard title="Dispute value prevented" value={42} prefix="RM " suffix="K" icon={ShieldAlert} risk="green" /></div>
      <div className="grid grid-cols-[1fr_430px] gap-6">
        <TruckScanFlow truck={truck} running={running} onComplete={finish} />
        <section className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between"><h3 className="text-2xl font-black text-white">Incoming manifest</h3><span className="rounded-full bg-amber-300/10 px-3 py-1 text-sm font-bold text-amber-100">{truck.truck_id}</span></div>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p className="rounded-2xl bg-white/[0.04] p-3"><b className="text-white">Supplier:</b> Genting Fresh Foods Sdn Bhd</p>
            <p className="rounded-2xl bg-white/[0.04] p-3"><b className="text-white">PO:</b> {truck.po_id}</p>
            <p className="rounded-2xl bg-white/[0.04] p-3"><b className="text-white">Items:</b> {truck.items.join(', ')}</p>
            <p className="rounded-2xl bg-white/[0.04] p-3"><b className="text-white">Temperature:</b> {truck.temperature}°C</p>
            <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-100"><AlertTriangle size={16} className="mr-2 inline" /><b>Mismatch:</b> {truck.damage_detected}</p>
            <p className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100"><FileCheck2 size={16} className="mr-2 inline" /><b>Action:</b> Auto-GRN created with exception note</p>
          </div>
          <button onClick={startScan} className="gold-button mt-6 w-full rounded-2xl px-5 py-4 font-black">Scan Incoming Truck</button>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => completeTruckScan(truck)} className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100">Create GRN</button>
            <button onClick={() => notify('Cold storage route assigned for frozen fries and fresh vegetables')} className="rounded-2xl border border-sky-300/25 bg-sky-300/10 px-4 py-3 font-bold text-sky-100">Route to Cold Storage</button>
            <button onClick={() => notify(`Damage claim escalated: ${formatRM(4200)} dispute value`)} className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 font-bold text-amber-100">Escalate Damage Claim</button>
            <button onClick={() => notify('Truck released after exception GRN and putaway routing')} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-200">Release Truck</button>
          </div>
        </section>
      </div>
    </div>
  );
}
