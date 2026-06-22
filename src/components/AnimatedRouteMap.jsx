import { motion } from 'framer-motion';
import { Warehouse, Truck, Hotel, Utensils, ShoppingBag, FerrisWheel, Wrench, Network } from 'lucide-react';
import RiskBadge from './RiskBadge';

const nodeConfig = [
  { name: 'Supplier Network', x: 6, y: 45, icon: Network },
  { name: 'Receiving Gate', x: 23, y: 45, icon: Truck },
  { name: 'Central Warehouse', x: 43, y: 45, icon: Warehouse },
  { name: 'First World Hotel', x: 62, y: 18, icon: Hotel },
  { name: 'F&B Outlets', x: 65, y: 44, icon: Utensils },
  { name: 'SkyAvenue Retail', x: 65, y: 70, icon: ShoppingBag },
  { name: 'Theme Parks', x: 87, y: 37, icon: FerrisWheel },
  { name: 'Maintenance Warehouse', x: 86, y: 68, icon: Wrench }
];

const lines = [
  ['Supplier Network', 'Receiving Gate'], ['Receiving Gate', 'Central Warehouse'], ['Central Warehouse', 'First World Hotel'],
  ['Central Warehouse', 'F&B Outlets'], ['Central Warehouse', 'SkyAvenue Retail'], ['F&B Outlets', 'Theme Parks'],
  ['SkyAvenue Retail', 'Theme Parks'], ['Central Warehouse', 'Maintenance Warehouse']
];

const getNode = (name) => nodeConfig.find(n => n.name === name);

export default function AnimatedRouteMap({ zones = [], pulse = false, onNodeClick }) {
  const zoneByName = Object.fromEntries(zones.map(z => [z.zone_name, z]));
  return (
    <div className="relative h-[520px] overflow-hidden rounded-3xl border border-amber-300/15 bg-slate-950/40 p-5 card-glow">
      <div className="absolute inset-0 navy-grid opacity-80" />
      <div className="absolute left-[6%] top-[66%] h-28 w-[88%] rounded-[100%] bg-amber-200/5 blur-2xl" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {lines.map(([from, to], i) => {
          const a = getNode(from); const b = getNode(to);
          return (
            <motion.path
              key={`${from}-${to}`}
              d={`M ${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y - 10 + i % 3 * 8}, ${(a.x + b.x) / 2} ${b.y + 10 - i % 3 * 8}, ${b.x} ${b.y}`}
              fill="none"
              stroke={pulse ? 'rgba(248,201,76,.95)' : 'rgba(125,211,252,.38)'}
              strokeWidth={pulse ? 0.45 : 0.32}
              className="animate-route"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: i * 0.08 }}
            />
          );
        })}
      </svg>
      {nodeConfig.map((node, i) => {
        const zone = zoneByName[node.name] || {};
        const Icon = node.icon;
        return (
          <motion.button
            key={node.name}
            onClick={() => onNodeClick?.(zone)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="absolute z-10 w-40 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-left shadow-2xl backdrop-blur hover:border-amber-300/50 hover:bg-slate-900"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="flex items-start gap-2">
              <span className="rounded-xl bg-amber-300/10 p-2 text-amber-200"><Icon size={18} /></span>
              <div className="min-w-0">
                <p className="text-sm font-black text-white">{node.name}</p>
                <p className="mt-1 truncate text-xs text-slate-400">{zone.current_status || 'Operating'}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <RiskBadge risk={zone.risk_level || 'Green'} />
              <span className="text-xs text-slate-400">{zone.active_alerts || 0} alerts</span>
            </div>
          </motion.button>
        );
      })}
      <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-slate-950/75 p-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mountain digital twin</p>
        <p className="mt-1 text-lg font-black text-white">Connected nodes, live route risk, agent actions</p>
      </div>
    </div>
  );
}
