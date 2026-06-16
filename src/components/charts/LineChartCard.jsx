import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import useTheme from "../../hooks/useTheme";
import { BorderBeam, GlareHover } from "../reactbits";

function LineChartCard({
  title,
  subtitle,
  data = [],
  xKey = "date",
  yKey = "count",
  color = "#3b82f6",
  variant = "line"
}) {
  const { isDark } = useTheme();
  const chartData = [...data].reverse();
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="display-font text-xl font-bold text-primary">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey={yKey}
                  stroke={color}
                  fillOpacity={1}
                  fill={`url(#gradient-${yKey})`}
                  strokeWidth={3}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
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
                <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={3} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </GlareHover>
    </BorderBeam>
  );
}

export default LineChartCard;
