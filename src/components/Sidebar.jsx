import { BarChart3, Bot, Boxes, Building2, CalendarClock, ChefHat, ClipboardList, Factory, Map, PackageSearch, Route, ShoppingBag, Truck } from 'lucide-react';

const icons = { ControlTower: Map, DemandSimulator: CalendarClock, FNB: ChefHat, Receiving: Truck, Inventory: Boxes, Retail: ShoppingBag, Supplier: ClipboardList, GenBI: Bot, BusinessCase: BarChart3, Roadmap: Route };

export const navItems = [
  { id: 'ControlTower', label: 'Control Tower', icon: 'ControlTower' },
  { id: 'DemandSimulator', label: 'Demand Shock', icon: 'DemandSimulator' },
  { id: 'FNB', label: 'F&B Procurement', icon: 'FNB' },
  { id: 'Receiving', label: 'AI Receiving Gate', icon: 'Receiving' },
  { id: 'Inventory', label: 'Inventory Balancing', icon: 'Inventory' },
  { id: 'Retail', label: 'Retail Intelligence', icon: 'Retail' },
  { id: 'Supplier', label: 'Supplier & Contracts', icon: 'Supplier' },
  { id: 'GenBI', label: 'Ask AIONOS', icon: 'GenBI' },
  { id: 'BusinessCase', label: 'Business Case', icon: 'BusinessCase' },
  { id: 'Roadmap', label: 'Pilot Roadmap', icon: 'Roadmap' }
];

export default function Sidebar({ activePage, setActivePage, presentationMode }) {
  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-slate-950/90 p-4 backdrop-blur-xl transition-all ${presentationMode ? 'w-[92px]' : 'w-[292px]'}`}>
      <button onClick={() => setActivePage('ControlTower')} className="mb-8 flex w-full items-center gap-3 rounded-3xl border border-amber-300/15 bg-amber-300/10 p-3 text-left">
        <div className="rounded-2xl bg-gradient-to-br from-amber-200 to-amber-600 p-3 text-slate-950"><Building2 size={24} /></div>
        {!presentationMode && <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">AIONOS × RWG</p><h1 className="text-lg font-black text-white">Mountain AI Tower</h1></div>}
      </button>
      <nav className="space-y-2">
        {navItems.map(item => {
          const Icon = icons[item.icon] || PackageSearch;
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${active ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20' : 'text-slate-300 hover:bg-white/[0.06] hover:text-amber-100'}`}>
              <Icon size={19} />
              {!presentationMode && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      {!presentationMode && <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Core Message</p><p className="mt-2 text-sm font-bold text-white">RWG does not need another dashboard. It needs AI agents that act across the mountain.</p></div>}
    </aside>
  );
}
