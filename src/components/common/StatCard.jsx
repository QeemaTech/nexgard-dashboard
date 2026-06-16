import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import AnimatedNumber from "../motion/AnimatedNumber";
import SpotlightCard from "../motion/SpotlightCard";
import { BorderBeam, GlareHover } from "../reactbits";

function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue }) {
  return (
    <BorderBeam className="h-full rounded-[var(--radius-card)]">
      <SpotlightCard className="card-surface card-surface-interactive h-full p-6">
        <GlareHover className="h-full w-full rounded-[inherit]">
          <div className="relative z-[1]">
            <div className="mb-4 flex items-start justify-between">
              {Icon ? (
                <div className="stat-icon">
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <div />
              )}
              {trend && trendValue !== undefined ? (
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                    trend === "up" ? "trend-up" : "trend-down"
                  }`}
                >
                  {trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {trendValue}%
                </div>
              ) : null}
            </div>
            <div className="display-font text-3xl font-bold tracking-tight text-primary">
              <AnimatedNumber value={value} />
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-wider text-muted">{title}</div>
            {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
          </div>
        </GlareHover>
      </SpotlightCard>
    </BorderBeam>
  );
}

export default StatCard;
