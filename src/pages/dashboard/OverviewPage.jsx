import { useEffect, useMemo, useState } from "react";
import { Activity, MessageSquare, QrCode, Ticket, Users } from "lucide-react";
import reportsApi from "../../api/reportsApi";
import StatCard from "../../components/common/StatCard";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import BlurFade from "../../components/motion/BlurFade";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import LineChartCard from "../../components/charts/LineChartCard";
import BarChartCard from "../../components/charts/BarChartCard";
import SelectInput from "../../components/forms/SelectInput";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import useTranslation from "../../hooks/useTranslation";
import formatNumber from "../../utils/formatNumber";
import AnimatedListItem from "../../components/reactbits/AnimatedListItem";
import { BorderBeam, GlareHover } from "../../components/reactbits";

function OverviewPage() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    period: "30d",
    from: "",
    to: ""
  });

  async function loadOverview(currentFilters) {
    setLoading(true);
    setError("");
    try {
      const response = await reportsApi.overview({
        period: currentFilters.period || undefined,
        from: currentFilters.from || undefined,
        to: currentFilters.to || undefined
      });
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topProductsChartData = useMemo(
    () =>
      (data?.topProducts || []).map((item) => ({
        name: item.product?.name || "N/A",
        value: item.scans || 0
      })),
    [data]
  );

  const topClinicsChartData = useMemo(
    () =>
      (data?.topClinics || []).map((item) => ({
        name: item.clinic?.name || "N/A",
        value: item.redemptions || 0
      })),
    [data]
  );

  const recentRedemptions = useMemo(() => data?.redemptionsOverTime?.slice(0, 5) || [], [data]);

  return (
    <section className="space-y-8 pb-12">
      <BlurFade className="card-surface p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <SelectInput
            label={t("common.period")}
            value={filters.period}
            onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value }))}
            options={[
              { label: t("common.period7d"), value: "7d" },
              { label: t("common.period30d"), value: "30d" },
              { label: t("common.period90d"), value: "90d" }
            ]}
          />
          <FormInput
            label={t("common.from")}
            type="datetime-local"
            value={filters.from}
            onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
          />
          <FormInput
            label={t("common.to")}
            type="datetime-local"
            value={filters.to}
            onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
          />
          <div className="flex items-end gap-2">
            <Button onClick={() => loadOverview(filters)}>{t("common.apply")}</Button>
            <Button
              variant="secondary"
              onClick={() => {
                const next = { period: "30d", from: "", to: "" };
                setFilters(next);
                loadOverview(next);
              }}
            >
              {t("common.reset")}
            </Button>
          </div>
        </div>
      </BlurFade>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && data ? (
        <>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <StatCard title={t("overview.totalScans")} value={data.totalScans} icon={QrCode} />
            </StaggerItem>
            <StaggerItem>
              <StatCard title={t("overview.registeredUsers")} value={data.totalUsers} icon={Users} />
            </StaggerItem>
            <StaggerItem>
              <StatCard title={t("overview.pointsEarned")} value={data.totalPointsEarned} icon={Ticket} />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title={t("overview.totalRedemptions")}
                value={data.totalRedemptions}
                icon={MessageSquare}
              />
            </StaggerItem>
          </Stagger>

          <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-3" stagger={0.08}>
            <StaggerItem className="lg:col-span-2">
              <LineChartCard
                title={t("overview.scanningTrends")}
                subtitle={t("overview.scanningTrendsHint")}
                data={data.scansOverTime || []}
                variant="area"
              />
            </StaggerItem>

            <StaggerItem>
            <BorderBeam className="rounded-[var(--radius-card)]">
            <GlareHover className="card-surface h-full w-full p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="display-font text-xl font-bold text-primary">
                  {t("overview.redemptionFeed")}
                </h3>
                <Activity className="h-5 w-5 text-muted" />
              </div>
              <div className="space-y-2">
                {recentRedemptions.length ? (
                  recentRedemptions.map((item, index) => (
                    <AnimatedListItem
                      key={`${item.date}-${index}`}
                      index={index}
                      className="group flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-panel"
                    >
                      <div className="feed-avatar flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=redemption-${index}`}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-primary">{item.date}</p>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          {t("overview.dailyRedemptions")}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="text-sm font-extrabold text-success">
                          +{formatNumber(item.count)}
                        </p>
                      </div>
                    </AnimatedListItem>
                  ))
                ) : (
                  <p className="text-sm text-muted">{t("overview.noRedemptions")}</p>
                )}
              </div>
            </GlareHover>
            </BorderBeam>
            </StaggerItem>
          </Stagger>

          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StaggerItem>
              <StatCard title={t("overview.totalPets")} value={data.totalPets} icon={Users} />
            </StaggerItem>
            <StaggerItem>
              <StatCard title={t("overview.totalProducts")} value={data.totalProducts} icon={QrCode} />
            </StaggerItem>
            <StaggerItem>
              <StatCard title={t("overview.totalQrCodes")} value={data.totalQRCodes} icon={QrCode} />
            </StaggerItem>
            <StaggerItem>
              <StatCard title={t("overview.pointsRedeemed")} value={data.totalPointsRedeemed} icon={Ticket} />
            </StaggerItem>
          </Stagger>

          <Stagger className="grid gap-6 xl:grid-cols-2" stagger={0.07}>
            <StaggerItem>
            <BarChartCard
              title={t("overview.topProducts")}
              subtitle={t("overview.topProductsHint")}
              data={topProductsChartData}
            />
            </StaggerItem>
            <StaggerItem>
            <BarChartCard
              title={t("overview.topClinics")}
              subtitle={t("overview.topClinicsHint")}
              data={topClinicsChartData}
              color="#6366f1"
            />
            </StaggerItem>
          </Stagger>

          <Stagger className="grid gap-6 xl:grid-cols-2" stagger={0.07}>
            <StaggerItem>
            <LineChartCard
              title={t("overview.redemptionsOverTime")}
              subtitle={t("overview.redemptionsOverTimeHint")}
              data={data.redemptionsOverTime || []}
              color="#059669"
              variant="area"
            />
            </StaggerItem>
            <StaggerItem>
            <div className="grid grid-cols-2 gap-4">
              <StatCard title={t("overview.usedQrCodes")} value={data.usedQRCodes} />
              <StatCard title={t("overview.unusedQrCodes")} value={data.unusedQRCodes} />
              <StatCard title={t("overview.totalRewards")} value={data.totalRewards} />
              <StatCard title={t("overview.activeProducts")} value={data.totalProducts} />
            </div>
            </StaggerItem>
          </Stagger>
        </>
      ) : null}
    </section>
  );
}

export default OverviewPage;
