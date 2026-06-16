import useTranslation from "../../hooks/useTranslation";
import BrandLoader from "./BrandLoader";
import Skeleton from "./Skeleton";

function PageLoader({ variant = "page" }) {
  const { t } = useTranslation();

  if (variant === "splash") {
    return <BrandLoader variant="splash" label={t("common.loadingPage")} />;
  }

  if (variant === "minimal") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <BrandLoader variant="compact" label={t("common.loadingPage")} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 py-2">
      <div className="flex items-center gap-4">
        <BrandLoader variant="inline" showLabel={false} className="shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="card-surface space-y-4 p-6">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card-surface space-y-4 p-6 xl:col-span-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
        <div className="card-surface space-y-4 p-6">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {t("common.loadingPage")}
      </p>
    </div>
  );
}

export default PageLoader;
