export const formatRM = (value) => new Intl.NumberFormat('en-MY', {
  style: 'currency', currency: 'MYR', maximumFractionDigits: 0
}).format(value || 0).replace('MYR', 'RM');

export const compactNumber = (value) => new Intl.NumberFormat('en', {
  notation: 'compact', maximumFractionDigits: 1
}).format(value || 0);

export const getRiskScore = (risk) => {
  const normalized = String(risk || '').toLowerCase();
  if (normalized.includes('red')) return 90;
  if (normalized.includes('amber')) return 58;
  return 24;
};

export const riskColorClass = (risk) => {
  const normalized = String(risk || '').toLowerCase();
  if (normalized.includes('red')) return 'bg-red-500/15 text-red-200 border-red-400/40 shadow-red-500/15';
  if (normalized.includes('amber')) return 'bg-amber-500/15 text-amber-200 border-amber-400/40 shadow-amber-500/15';
  return 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40 shadow-emerald-500/15';
};

export const severityDotClass = (risk) => {
  const normalized = String(risk || '').toLowerCase();
  if (normalized.includes('red')) return 'bg-red-400';
  if (normalized.includes('amber')) return 'bg-amber-300';
  return 'bg-emerald-300';
};

export const buildForecastRows = (item) => {
  const labels = ['8 AM','10 AM','12 PM','2 PM','4 PM','6 PM'];
  return labels.map((label, i) => ({
    time: label,
    baseline: item.forecast?.[i] || 0,
    eventAdjusted: item.event_forecast?.[i] || 0
  }));
};

export const sumBusinessValue = (businessCase) => businessCase.reduce((sum, item) => sum + Number(item.value_rm || 0), 0);

export const exportToCsv = (rows, filename = 'aionos-action-log.csv') => {
  const safeRows = rows || [];
  if (!safeRows.length) return;
  const headers = Object.keys(safeRows[0]);
  const csv = [headers.join(','), ...safeRows.map(row => headers.map(h => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToJson = (payload, filename = 'aionos-action-log.json') => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
