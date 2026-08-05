import { useCallback, useEffect, useMemo, useState } from "react";
import petOptionsApi from "../api/petOptionsApi";
import useTranslation from "./useTranslation";

/** Arabic label when the dashboard is in Arabic, English otherwise */
export function petOptionLabel(option, isRtl) {
  if (!option) return "";
  return (isRtl && option.labelAr) || option.label || "";
}

/**
 * Active weight/age dropdown options, as managed by admins under Pet Options.
 * Returns select-ready `{ label, value }` arrays plus the raw rows.
 */
function usePetOptions() {
  const { isRtl } = useTranslation();
  const [weightRanges, setWeightRanges] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await petOptionsApi.all();
      const data = response.data.data || {};
      setWeightRanges(data.weightRanges || []);
      setAgeRanges(data.ageRanges || []);
    } catch {
      setWeightRanges([]);
      setAgeRanges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const weightOptions = useMemo(
    () => weightRanges.map((row) => ({ label: petOptionLabel(row, isRtl), value: row.id })),
    [weightRanges, isRtl]
  );

  const ageOptions = useMemo(
    () => ageRanges.map((row) => ({ label: petOptionLabel(row, isRtl), value: row.id })),
    [ageRanges, isRtl]
  );

  return { weightRanges, ageRanges, weightOptions, ageOptions, loading, reload: load };
}

export default usePetOptions;
