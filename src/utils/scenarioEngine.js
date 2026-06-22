const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const action = (id, agent, type, description, value, confidence = 92) => ({
  action_id: `${id}-${Date.now()}`,
  timestamp: nowTime(),
  agent_name: agent,
  action_type: type,
  description,
  status: 'New Recommendation',
  value_impact_rm: value,
  confidence
});

export const scenarioDefinitions = {
  concert: {
    title: 'Concert Night Surge',
    subtitle: 'Occupancy, F&B demand, retail velocity and receiving load spike together.',
    eventBanner: 'Saturday | Concert Night | 96% Hotel Occupancy | F&B Demand Surge | Retail Spike | Gate Load +26%'
  },
  rain: {
    title: 'Rain + Road Constraint',
    subtitle: 'Mountain route risk increases, cold-chain moves are prioritised, linen movements delayed.',
    eventBanner: 'Saturday | Heavy Rain | Road Constraint | Cold Chain Priority | Gate Congestion | Linen Movement Delayed'
  },
  viral: {
    title: 'Viral Merchandise Spike',
    subtitle: 'SkyWorlds Dragon Plush goes viral and triggers AI transfer + replenishment.',
    eventBanner: 'Saturday | Viral IP Item | SkyWorlds Dragon Plush 3x Velocity | Revenue-at-Risk Rising'
  }
};

export function applyScenario(key, data) {
  const cloned = JSON.parse(JSON.stringify(data));
  let kpiDelta = {};
  let newActions = [];
  let activatedAgents = [];
  let summary = '';

  if (key === 'concert') {
    cloned.fnbInventory = cloned.fnbInventory.map(item => {
      if (['Bottled water', 'Frozen fries', 'Bakery buns'].includes(item.item_name)) {
        const multiplier = item.item_name === 'Frozen fries' ? 1.41 : 1.32;
        return { ...item, predicted_demand: Math.round(item.predicted_demand * multiplier), days_cover: Math.max(0.4, Number((item.days_cover * 0.72).toFixed(1))), risk_level: 'Red', po_status: 'Recommended' };
      }
      return item;
    });
    cloned.retailSkus = cloned.retailSkus.map(sku => sku.sku_name === 'SkyWorlds Dragon Plush'
      ? { ...sku, hourly_sales_velocity: 52, predicted_stockout_hours: 1.4, revenue_at_risk_rm: 36800, recommended_transfer_qty: 140, history: [10, 18, 24, 33, 44, 52] }
      : sku);
    cloned.resortZones = cloned.resortZones.map(zone => ['F&B Outlets', 'Receiving Gate', 'Theme Parks', 'SkyAvenue Retail'].includes(zone.zone_name)
      ? { ...zone, risk_level: 'Red', active_alerts: zone.active_alerts + 2, inventory_health: Math.max(50, zone.inventory_health - 9) }
      : zone);
    kpiDelta = { stockoutRisk: 82, gateCongestion: 76, inventoryAtRisk: 3.8, retailOpportunity: 0.42, supplierSla: 41, aiActions: 18 };
    newActions = [
      action('ACT-SURGE-FNB', 'Demand Agent', 'Scenario Detection', 'Concert surge detected: F&B demand +38%, bottled drinks +44%, frozen food +29%.', 118000, 96),
      action('ACT-SURGE-PO', 'Procurement Agent', 'Auto PO Draft', 'Recommended expedited POs for bottled water, frozen fries and bakery buns.', 154000, 94),
      action('ACT-SURGE-RTL', 'Retail Agent', 'Transfer Recommendation', 'Pre-position Dragon Plush at SkyWorlds exit store before concert exit flow.', 36800, 93)
    ];
    activatedAgents = ['Demand Agent', 'Procurement Agent', 'Receiving Agent', 'Retail Agent', 'Inventory Agent'];
    summary = 'Concert surge applied. The control tower increased F&B risk, retail velocity, receiving load and generated three AI recommendations.';
  }

  if (key === 'rain') {
    cloned.resortZones = cloned.resortZones.map(zone => ['Receiving Gate', 'Central Warehouse', 'First World Hotel'].includes(zone.zone_name)
      ? { ...zone, risk_level: zone.zone_name === 'Receiving Gate' ? 'Red' : 'Amber', active_alerts: zone.active_alerts + 1, current_status: zone.zone_name === 'First World Hotel' ? 'Delay non-critical linen movement due to rain' : zone.current_status }
      : zone);
    cloned.warehouseInventory = cloned.warehouseInventory.map(item => item.sku_name === 'Linen'
      ? { ...item, recommended_action: 'Delay non-critical linen movement due to rain and route covered vehicles only' }
      : item.sku_name === 'Frozen fries'
        ? { ...item, recommended_action: 'Prioritise cold-chain route and receive before 4 PM' }
        : item);
    kpiDelta = { stockoutRisk: 64, gateCongestion: 88, inventoryAtRisk: 2.9, retailOpportunity: 0.31, supplierSla: 55, aiActions: 15 };
    newActions = [
      action('ACT-RAIN-ROUTE', 'Logistics Agent', 'Route Constraint', 'Rain and mountain road constraint detected; prioritised cold-chain inbound window.', 64000, 91),
      action('ACT-RAIN-LINEN', 'Inventory Agent', 'Movement Deferral', 'Delayed non-critical linen transfer to protect service and reduce route congestion.', 22000, 88)
    ];
    activatedAgents = ['Logistics Agent', 'Receiving Agent', 'Inventory Agent'];
    summary = 'Rain constraint applied. Receiving gate congestion rose, cold-chain deliveries were prioritised and linen movements were delayed.';
  }

  if (key === 'viral') {
    cloned.retailSkus = cloned.retailSkus.map(sku => sku.sku_name === 'SkyWorlds Dragon Plush'
      ? { ...sku, hourly_sales_velocity: 66, predicted_stockout_hours: 0.9, recommended_transfer_qty: 180, revenue_at_risk_rm: 52600, history: [12, 19, 28, 41, 54, 66] }
      : sku);
    cloned.warehouseInventory = cloned.warehouseInventory.map(item => item.sku_name === 'SkyWorlds Dragon Plush'
      ? { ...item, recommended_action: 'Transfer 180 units to SkyWorlds exit store and trigger replenishment PO' }
      : item);
    cloned.resortZones = cloned.resortZones.map(zone => ['SkyAvenue Retail', 'Theme Parks'].includes(zone.zone_name)
      ? { ...zone, risk_level: 'Red', active_alerts: zone.active_alerts + 2, inventory_health: Math.max(45, zone.inventory_health - 12) }
      : zone);
    kpiDelta = { stockoutRisk: 68, gateCongestion: 58, inventoryAtRisk: 2.6, retailOpportunity: 0.53, supplierSla: 32, aiActions: 16 };
    newActions = [
      action('ACT-VIRAL-SKU', 'Retail Agent', 'Viral SKU Surge', 'SkyWorlds Dragon Plush velocity rose 3x; transfer 180 units to exit store.', 52600, 95),
      action('ACT-VIRAL-PO', 'Retail Agent', 'Replenishment PO', 'Triggered replenishment PO and recommended Sunday allocation plan.', 71000, 92)
    ];
    activatedAgents = ['Retail Agent', 'Inventory Agent', 'Procurement Agent'];
    summary = 'Viral merchandise scenario applied. Retail revenue-at-risk increased and the AI recommended transfer plus replenishment action.';
  }

  return { data: cloned, kpiDelta, newActions, activatedAgents, summary, definition: scenarioDefinitions[key] };
}
