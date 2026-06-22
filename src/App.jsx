import { useCallback, useMemo, useState } from 'react';
import Layout from './components/Layout';
import { DemoContext } from './context/DemoContext';
import ControlTower from './pages/ControlTower';
import DemandSimulator from './pages/DemandSimulator';
import FNBProcurementAgent from './pages/FNBProcurementAgent';
import ReceivingGate from './pages/ReceivingGate';
import InventoryBalancing from './pages/InventoryBalancing';
import RetailMerchandise from './pages/RetailMerchandise';
import SupplierIntelligence from './pages/SupplierIntelligence';
import GenBIAgent from './pages/GenBIAgent';
import BusinessCaseCockpit from './pages/BusinessCaseCockpit';
import PilotRoadmap from './pages/PilotRoadmap';
import { applyScenario, scenarioDefinitions } from './utils/scenarioEngine';

import resortZones from './data/resort_zones.json';
import eventsCalendar from './data/events_calendar.json';
import fnbInventory from './data/fnb_inventory.json';
import suppliers from './data/suppliers.json';
import purchaseOrders from './data/purchase_orders.json';
import receivingTrucks from './data/receiving_trucks.json';
import warehouseInventory from './data/warehouse_inventory.json';
import retailSkus from './data/retail_skus.json';
import contracts from './data/contracts.json';
import agentActions from './data/agent_actions.json';
import genbiKnowledgeBase from './data/genbi_knowledge_base.json';
import businessCase from './data/business_case.json';

const initialData = {
  resortZones,
  eventsCalendar,
  fnbInventory,
  suppliers,
  purchaseOrders,
  receivingTrucks,
  warehouseInventory,
  retailSkus,
  contracts,
  agentActions,
  genbiKnowledgeBase,
  businessCase
};

const initialKpis = {
  stockoutRisk: 67,
  gateCongestion: 58,
  supplierSla: 39,
  inventoryAtRisk: 2.4,
  retailOpportunity: 0.31,
  aiActions: agentActions.length
};

const pages = {
  ControlTower: <ControlTower />,
  DemandSimulator: <DemandSimulator />,
  FNB: <FNBProcurementAgent />,
  Receiving: <ReceivingGate />,
  Inventory: <InventoryBalancing />,
  Retail: <RetailMerchandise />,
  Supplier: <SupplierIntelligence />,
  GenBI: <GenBIAgent />,
  BusinessCase: <BusinessCaseCockpit />,
  Roadmap: <PilotRoadmap />
};

const timeStamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const [activePage, setActivePage] = useState('ControlTower');
  const [data, setData] = useState(initialData);
  const [kpis, setKpis] = useState(initialKpis);
  const [toast, setToast] = useState('');
  const [activeScenario, setActiveScenario] = useState(null);
  const [routePulse, setRoutePulse] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [eventBanner, setEventBanner] = useState('Saturday | Concert Night | 92% Hotel Occupancy | Rain Risk | F&B Demand Surge | Retail Spike');

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.__aionosToast);
    window.__aionosToast = window.setTimeout(() => setToast(''), 2800);
  }, []);

  const addAgentAction = useCallback((payload) => {
    const entry = {
      action_id: payload.action_id || `ACT-${Date.now()}`,
      timestamp: payload.timestamp || timeStamp(),
      status: payload.status || 'New Recommendation',
      confidence: payload.confidence || 91,
      value_impact_rm: payload.value_impact_rm || 0,
      ...payload
    };
    setData(prev => ({ ...prev, agentActions: [entry, ...prev.agentActions] }));
    setKpis(prev => ({ ...prev, aiActions: prev.aiActions + 1 }));
    return entry;
  }, []);

  const triggerRoutePulse = useCallback(() => {
    setRoutePulse(true);
    window.setTimeout(() => setRoutePulse(false), 3200);
  }, []);

  const runScenario = useCallback((key) => {
    const result = applyScenario(key, data);
    setActiveScenario(key);
    setData({ ...result.data, agentActions: [...result.newActions, ...result.data.agentActions] });
    setKpis(prev => ({ ...prev, ...result.kpiDelta }));
    setEventBanner(result.definition?.eventBanner || scenarioDefinitions[key]?.eventBanner || eventBanner);
    triggerRoutePulse();
    notify(result.summary);
  }, [data, eventBanner, notify, triggerRoutePulse]);

  const approvePO = useCallback((item) => {
    setData(prev => ({
      ...prev,
      fnbInventory: prev.fnbInventory.map(row => row.item_id === item.item_id ? { ...row, po_status: 'PO Approved' } : row),
      purchaseOrders: prev.purchaseOrders.map(po => po.item_id === item.item_id ? { ...po, status: 'Approved', approval_status: 'Approved by presenter' } : po)
    }));
    addAgentAction({
      agent_name: 'Procurement Agent',
      action_type: 'PO Approved',
      description: `PO approved for ${item.item_name}: ${item.recommended_po_qty.toLocaleString()} ${item.unit}, delivery slot reserved.`,
      value_impact_rm: Math.round(item.recommended_po_qty * item.contract_price * 1.35),
      confidence: 96,
      status: 'Approved'
    });
    setKpis(prev => ({ ...prev, stockoutRisk: Math.max(28, prev.stockoutRisk - 6), inventoryAtRisk: Math.max(1.2, Number((prev.inventoryAtRisk - 0.1).toFixed(1))) }));
    notify(`PO approved for ${item.item_name}`);
  }, [addAgentAction, notify]);

  const completeTruckScan = useCallback((truck) => {
    setData(prev => ({
      ...prev,
      receivingTrucks: prev.receivingTrucks.map(row => row.truck_id === truck.truck_id ? { ...row, grn_status: 'Auto-GRN created', exception_status: row.damage_detected === 'None' ? 'None' : 'Exception note created' } : row)
    }));
    addAgentAction({
      agent_name: 'Receiving Agent',
      action_type: 'Auto-GRN',
      description: `Auto-GRN created for ${truck.truck_id}; ${truck.damage_detected} captured and cold-chain putaway route assigned.`,
      value_impact_rm: 42000,
      confidence: 94,
      status: 'Completed'
    });
    setKpis(prev => ({ ...prev, gateCongestion: Math.max(30, prev.gateCongestion - 7) }));
    notify(`Auto-GRN created for ${truck.truck_id}`);
  }, [addAgentAction, notify]);

  const approveTransfer = useCallback((item) => {
    setData(prev => ({
      ...prev,
      warehouseInventory: prev.warehouseInventory.map(row => row.sku_id === item.sku_id ? { ...row, recommended_action: `Transfer approved to ${item.transfer_target}` } : row)
    }));
    addAgentAction({
      agent_name: 'Inventory Agent',
      action_type: 'Transfer Approved',
      description: `${item.sku_name} movement approved from ${item.location} to ${item.transfer_target}.`,
      value_impact_rm: 24000,
      confidence: 92,
      status: 'Approved'
    });
    triggerRoutePulse();
    notify(`Transfer approved for ${item.sku_name}`);
  }, [addAgentAction, notify, triggerRoutePulse]);

  const approveRetailTransfer = useCallback((sku) => {
    setData(prev => ({
      ...prev,
      retailSkus: prev.retailSkus.map(row => row.sku_id === sku.sku_id ? { ...row, current_stock: row.current_stock + row.recommended_transfer_qty, predicted_stockout_hours: Number((row.predicted_stockout_hours + 5.5).toFixed(1)) } : row)
    }));
    addAgentAction({
      agent_name: 'Retail Agent',
      action_type: 'Retail Transfer Approved',
      description: `Approved ${sku.recommended_transfer_qty} unit transfer for ${sku.sku_name} to protect ${sku.store} revenue.`,
      value_impact_rm: sku.revenue_at_risk_rm,
      confidence: 94,
      status: 'Approved'
    });
    setKpis(prev => ({ ...prev, retailOpportunity: Number((prev.retailOpportunity + sku.revenue_at_risk_rm / 1000000).toFixed(2)) }));
    triggerRoutePulse();
    notify(`Retail transfer approved for ${sku.sku_name}`);
  }, [addAgentAction, notify, triggerRoutePulse]);

  const contextValue = useMemo(() => ({
    data,
    kpis,
    toast,
    notify,
    addAgentAction,
    runScenario,
    activeScenario,
    routePulse,
    approvePO,
    completeTruckScan,
    approveTransfer,
    approveRetailTransfer,
    presentationMode,
    setPresentationMode,
    eventBanner
  }), [data, kpis, toast, notify, addAgentAction, runScenario, activeScenario, routePulse, approvePO, completeTruckScan, approveTransfer, approveRetailTransfer, presentationMode, eventBanner]);

  return (
    <DemoContext.Provider value={contextValue}>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {pages[activePage] || pages.ControlTower}
      </Layout>
    </DemoContext.Provider>
  );
}
