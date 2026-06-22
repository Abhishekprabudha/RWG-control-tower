import { riskColorClass, severityDotClass } from '../utils/calculations';

export default function RiskBadge({ risk = 'Green', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${riskColorClass(risk)} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${severityDotClass(risk)} animate-risk`} />
      {risk}
    </span>
  );
}
