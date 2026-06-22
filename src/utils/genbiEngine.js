import { formatRM } from './calculations';

const includesAny = (question, terms) => terms.some(term => question.includes(term));
const sortAsc = (array, selector) => [...array].sort((a, b) => selector(a) - selector(b));
const sortDesc = (array, selector) => [...array].sort((a, b) => selector(b) - selector(a));

export function getTopStockoutRisks(data) {
  const fnb = sortAsc(data.fnbInventory, item => item.days_cover).slice(0, 3);
  const retail = sortAsc(data.retailSkus, sku => sku.predicted_stockout_hours).slice(0, 2);
  return {
    answer: `${fnb[0].item_name} is the highest F&B stockout risk with only ${fnb[0].days_cover} days of cover. In retail, ${retail[0].sku_name} is projected to stock out in ${retail[0].predicted_stockout_hours} hours.`,
    action: `Approve ${fnb[0].recommended_po_qty.toLocaleString()} ${fnb[0].unit} PO for ${fnb[0].item_name} and transfer ${retail[0].recommended_transfer_qty} units of ${retail[0].sku_name}.`,
    confidence: 94,
    source: 'fnb_inventory.json, retail_skus.json',
    table: [
      ...fnb.map(item => ({ Type: 'F&B', Item: item.item_name, Risk: item.risk_level, Cover: `${item.days_cover} days`, Demand: item.predicted_demand })),
      ...retail.map(sku => ({ Type: 'Retail', Item: sku.sku_name, Risk: 'Revenue', Cover: `${sku.predicted_stockout_hours} hrs`, Demand: `${sku.hourly_sales_velocity}/hr` }))
    ]
  };
}

export function getWorstSupplierSLA(data) {
  const supplier = sortAsc(data.suppliers, s => s.sla_score)[0];
  return {
    answer: `${supplier.supplier_name} has the weakest SLA profile at ${supplier.sla_score}% with ${supplier.delivery_reliability}% delivery reliability and a risk score of ${supplier.risk_score}.`,
    action: 'Generate a negotiation brief, enforce service credits and qualify an alternate source for critical ride parts.',
    confidence: 92,
    source: 'suppliers.json, contracts.json',
    table: sortAsc(data.suppliers, s => s.sla_score).slice(0, 4).map(s => ({ Supplier: s.supplier_name, Category: s.category, SLA: `${s.sla_score}%`, Reliability: `${s.delivery_reliability}%`, Risk: s.risk_score }))
  };
}

export function getRecommendedReorder(data, itemName = '') {
  const items = itemName
    ? data.fnbInventory.filter(item => item.item_name.toLowerCase().includes(itemName.toLowerCase()))
    : data.fnbInventory;
  const item = sortAsc(items.length ? items : data.fnbInventory, i => i.days_cover)[0];
  return {
    answer: `${item.item_name} should be reordered first. Current days of cover is ${item.days_cover}, predicted demand is ${item.predicted_demand.toLocaleString()} ${item.unit}, and ${item.preferred_supplier} can deliver against a contracted price of RM ${item.contract_price}.`,
    action: `Approve a PO for ${item.recommended_po_qty.toLocaleString()} ${item.unit}. This avoids stockout risk while using the compliant preferred supplier.`,
    confidence: 96,
    source: 'fnb_inventory.json, purchase_orders.json, suppliers.json',
    table: [{ Item: item.item_name, Stock: `${item.current_stock} ${item.unit}`, Demand: item.predicted_demand, Cover: `${item.days_cover} days`, Supplier: item.preferred_supplier, PO: item.recommended_po_qty }]
  };
}

export function getFastestSellingSKU(data) {
  const sku = sortDesc(data.retailSkus, s => s.hourly_sales_velocity)[0];
  return {
    answer: `${sku.sku_name} is selling fastest at ${sku.hourly_sales_velocity} units per hour and is projected to stock out in ${sku.predicted_stockout_hours} hours at ${sku.store}.`,
    action: `Transfer ${sku.recommended_transfer_qty} units now and create a replenishment PO to protect ${formatRM(sku.revenue_at_risk_rm)} of revenue-at-risk.`,
    confidence: 94,
    source: 'retail_skus.json, warehouse_inventory.json',
    chart: sku.history.map((value, index) => ({ hour: `${8 + index * 2}:00`, velocity: value })),
    table: sortDesc(data.retailSkus, s => s.hourly_sales_velocity).slice(0, 4).map(s => ({ SKU: s.sku_name, Store: s.store, Velocity: `${s.hourly_sales_velocity}/hr`, Stockout: `${s.predicted_stockout_hours} hrs`, RevenueRisk: formatRM(s.revenue_at_risk_rm) }))
  };
}

export function getContractsExpiringSoon(data) {
  const soon = sortAsc(data.contracts.filter(c => c.renewal_days_left <= 90), c => c.renewal_days_left);
  const top = soon[0];
  return {
    answer: `${soon.length} contracts expire in the next 90 days. The most urgent is ${top.category}, with ${top.renewal_days_left} days left and ${top.price_benchmark_variance}% price benchmark variance.`,
    action: 'Start renewal triage now, prioritising IT Hardware, Hotel Linen and Maintenance Spares because they combine low days-left with price or SLA risk.',
    confidence: 91,
    source: 'contracts.json, suppliers.json',
    table: soon.map(c => ({ Contract: c.contract_id, Category: c.category, DaysLeft: c.renewal_days_left, Value: formatRM(c.contract_value_rm), Variance: `${c.price_benchmark_variance}%`, Risk: c.risk_notes }))
  };
}

export function getReceivingExceptions(data) {
  const exceptions = data.receivingTrucks.filter(t => t.exception_status !== 'None' || t.damage_detected !== 'None');
  const truck = exceptions[0] || data.receivingTrucks[0];
  return {
    answer: `The receiving gate detected ${truck.damage_detected} on truck ${truck.truck_id}. Temperature is ${truck.temperature}°C, seal status is ${truck.seal_status}, and GRN is currently ${truck.grn_status}.`,
    action: 'Create GRN with exception note, route valid cold-chain items to cold storage and escalate the damage claim to the supplier.',
    confidence: 93,
    source: 'receiving_trucks.json, purchase_orders.json',
    table: data.receivingTrucks.map(t => ({ Truck: t.truck_id, PO: t.po_id, Temp: `${t.temperature}°C`, Damage: t.damage_detected, GRN: t.grn_status, Exception: t.exception_status }))
  };
}

export function getRecommendedPilot(data) {
  const receivingValue = data.businessCase.find(m => m.metric_name.includes('Manual GRN'))?.value_rm || 0;
  const stockoutValue = data.businessCase.find(m => m.metric_name.includes('Stockout'))?.value_rm || 0;
  return {
    answer: `RWG should start with either AI Receiving Gate for operational wow or F&B Demand + PO Agent for fast procurement value. The strongest combined 12-week path is Receiving Gate first, then F&B PO automation.`,
    action: `Start with AI Receiving Gate if the audience is COO/CPO-heavy; start with F&B Demand + PO Agent if CFO value is the closing lever. Current visible value signals are ${formatRM(receivingValue)} in GRN productivity and ${formatRM(stockoutValue)} in stockout risk avoided.`,
    confidence: 90,
    source: 'business_case.json, agent_actions.json',
    table: [
      { Option: 'AI Receiving Gate', BestFor: 'Operational wow', FirstValue: formatRM(receivingValue), Time: '3-6 weeks' },
      { Option: 'F&B Demand + PO Agent', BestFor: 'CFO/procurement value', FirstValue: formatRM(stockoutValue), Time: '3-6 weeks' },
      { Option: 'Supplier Intelligence', BestFor: 'Procurement leadership', FirstValue: formatRM(165000), Time: '4-8 weeks' }
    ]
  };
}

export function getBusinessCaseSummary(data) {
  const total = data.businessCase.reduce((sum, item) => sum + Number(item.value_rm), 0);
  const top = sortDesc(data.businessCase, m => m.value_rm).slice(0, 3);
  return {
    answer: `The synthetic 12-week value pool currently totals ${formatRM(total)} across working capital, process productivity, commercial control and revenue protection.`,
    action: 'Use weekly value tracking in the pilot and separate hard savings from revenue protection and productivity capacity release.',
    confidence: 92,
    source: 'business_case.json',
    table: top.map(m => ({ Metric: m.metric_name, Category: m.category, Improvement: m.improvement, Value: formatRM(m.value_rm) }))
  };
}

export function getMaverickSpendOpportunities(data) {
  const contracts = sortDesc(data.contracts.filter(c => c.price_benchmark_variance >= 7 || c.risk_notes.toLowerCase().includes('duplicate') || c.risk_notes.toLowerCase().includes('maverick')), c => c.price_benchmark_variance);
  const top = contracts[0];
  return {
    answer: `The largest maverick or off-contract signal is ${top.category}, with ${top.price_benchmark_variance}% benchmark variance and risk note: ${top.risk_notes}.`,
    action: 'Lock catalogue buying, consolidate duplicate categories and use the negotiation brief before renewal.',
    confidence: 88,
    source: 'contracts.json, suppliers.json',
    table: contracts.map(c => ({ Category: c.category, Variance: `${c.price_benchmark_variance}%`, Value: formatRM(c.contract_value_rm), DaysLeft: c.renewal_days_left, Note: c.risk_notes }))
  };
}

export function explainPORecommendation(data, itemName = 'Frozen fries') {
  return getRecommendedReorder(data, itemName);
}

export function askGenBI(question, data) {
  const q = String(question || '').toLowerCase();
  if (!q.trim()) return null;
  if (includesAny(q, ['highest stockout', 'stockout risk', 'items at highest', 'at risk today'])) return getTopStockoutRisks(data);
  if (includesAny(q, ['worst sla', 'worst supplier', 'supplier has the worst'])) return getWorstSupplierSLA(data);
  if (includesAny(q, ['reorder first', 'f&b item', 'which item should', 'why did the ai recommend this po', 'why did ai recommend'])) return getRecommendedReorder(data, q.includes('water') ? 'Bottled water' : q.includes('fries') ? 'Frozen fries' : '');
  if (includesAny(q, ['fastest', 'selling fastest', 'merchandise sku', 'sku is selling'])) return getFastestSellingSKU(data);
  if (includesAny(q, ['contracts expire', 'renewal', 'next 90 days', 'expire in'])) return getContractsExpiringSoon(data);
  if (includesAny(q, ['receiving', 'gate detect', 'truck detect', 'damage'])) return getReceivingExceptions(data);
  if (includesAny(q, ['pilot', 'start with', 'roadmap'])) return getRecommendedPilot(data);
  if (includesAny(q, ['business case', 'roi', 'avoided stockouts', 'value of', 'receiving gate'])) return getBusinessCaseSummary(data);
  if (includesAny(q, ['maverick', 'off-contract', 'duplicate spend'])) return getMaverickSpendOpportunities(data);
  if (includesAny(q, ['inventory transfer', 'store needs', 'transfer now'])) {
    const item = data.warehouseInventory.find(w => w.recommended_action.toLowerCase().includes('transfer')) || data.warehouseInventory[0];
    return {
      answer: `${item.location} needs action for ${item.sku_name}: ${item.recommended_action}. Target is ${item.transfer_target}.`,
      action: 'Approve transfer and optimise route using the inventory balancing agent.',
      confidence: 91,
      source: 'warehouse_inventory.json',
      table: data.warehouseInventory.filter(w => w.recommended_action.toLowerCase().includes('transfer')).map(w => ({ Item: w.sku_name, Location: w.location, Qty: w.quantity, Action: w.recommended_action, Target: w.transfer_target }))
    };
  }
  return {
    answer: 'I can answer questions on procurement, inventory, suppliers, receiving, retail, contracts, pilot roadmap and business case.',
    action: 'Try asking: “Which item should we reorder first?”, “Which supplier has the worst SLA?”, or “Show me the business case for AI Receiving Gate.”',
    confidence: 72,
    source: 'genbi_knowledge_base.json',
    table: []
  };
}
