import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import useTheme from "../../hooks/useTheme";
import { BorderBeam, GlareHover } from "../reactbits";

function BarChartCard({ title, subtitle, data = [], xKey = "name", yKey = "value", color = "#3b82f6" }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipStyle = {
    borderRadius: "12px",
    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    background: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#f8fafc" : "#0f172a",
    boxShadow: isDark ? "0 10px 15px -3px rgba(0,0,0,0.2)" : "0 8px 24px rgb(37 99 235 / 0.12)"
  };

  return (
    <BorderBeam className="rounded-[var(--radius-card)]">
      <GlareHover className="card-surface h-full w-full p-8 shadow-sm">
        <div className="mb-8">
          <h3 className="display-font text-xl font-bold text-primary">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: tickColor, fontWeight: 600 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: tickColor, fontWeight: 600 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlareHover>
    </BorderBeam>
  );
}

export default BarChartCard;
