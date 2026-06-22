import RiskBadge from './RiskBadge';

export default function DataTable({ columns = [], rows = [], onRowClick, selectedId }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/35">
      <div className="thin-scrollbar max-h-[560px] overflow-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs uppercase tracking-[0.18em] text-slate-400 backdrop-blur">
            <tr>
              {columns.map(col => <th key={col.key} className="px-4 py-4 font-semibold">{col.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, rowIndex) => (
              <tr
                key={row.item_id || row.supplier_id || row.sku_id || row.contract_id || row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`transition ${onRowClick ? 'cursor-pointer hover:bg-amber-300/10' : ''} ${selectedId && Object.values(row).includes(selectedId) ? 'bg-amber-300/10' : ''}`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-4 text-slate-200">
                    {col.type === 'risk' ? <RiskBadge risk={row[col.key]} /> : col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
