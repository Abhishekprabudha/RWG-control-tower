import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const tooltipStyle = { background: '#0f172a', border: '1px solid rgba(248,201,76,.25)', borderRadius: 14, color: '#fff' };

export default function ForecastChart({ data = [], type = 'area', dataKeys = ['baseline', 'eventAdjusted'], height = 260 }) {
  const common = (
    <>
      <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
      <XAxis dataKey="time" stroke="rgba(226,232,240,.7)" tickLine={false} axisLine={false} />
      <YAxis stroke="rgba(226,232,240,.7)" tickLine={false} axisLine={false} width={46} />
      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(248,201,76,.08)' }} />
    </>
  );

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>{common}<Bar dataKey={dataKeys[0]} radius={[8,8,0,0]} fill="rgba(248,201,76,.85)" /></BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>{common}<Line type="monotone" dataKey={dataKeys[0]} stroke="#f8c94c" strokeWidth={3} dot={false} /></LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>{common}
        <Area type="monotone" dataKey={dataKeys[0]} stroke="#7dd3fc" fill="rgba(125,211,252,.16)" strokeWidth={2} />
        {dataKeys[1] && <Area type="monotone" dataKey={dataKeys[1]} stroke="#f8c94c" fill="rgba(248,201,76,.20)" strokeWidth={3} />}
      </AreaChart>
    </ResponsiveContainer>
  );
}
