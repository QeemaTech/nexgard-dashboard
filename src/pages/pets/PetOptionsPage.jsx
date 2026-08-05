import { useState } from "react";
import { Ruler, Timer } from "lucide-react";
import ResourceManager from "../../components/common/ResourceManager";
import PetOptionForm from "../../components/pets/PetOptionForm";
import petOptionsApi from "../../api/petOptionsApi";
import useTranslation from "../../hooks/useTranslation";

const PERMISSIONS = {
  create: ["pets.manage"],
  update: ["pets.manage"],
  delete: ["pets.manage"]
};

/** "" from an empty number input must reach the API as null, not NaN */
function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function toText(value) {
  return value === "" || value === undefined ? null : value;
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`segmented-tab ${active ? "segmented-tab--active" : "segmented-tab--inactive"}`}
    >
      <Icon className="me-1.5 inline h-3.5 w-3.5 align-[-2px]" />
      {children}
    </button>
  );
}

/** "2.5 - 5 kg" from the stored bounds, or "—" when both are blank */
function RangeCell({ min, max, unit, t }) {
  if (min == null && max == null) return <span className="text-muted">—</span>;
  const text =
    min != null && max != null
      ? `${min} – ${max} ${unit}`
      : min != null
        ? `${t("pages.petOptions.fromShort")} ${min} ${unit}`
        : `${t("pages.petOptions.toShort")} ${max} ${unit}`;
  return <span className="range-cell">{text}</span>;
}

function PetOptionsPage() {
  const { t, isRtl } = useTranslation();
  const [tab, setTab] = useState("weight");
  const isWeight = tab === "weight";
  const api = isWeight ? petOptionsApi.weightRanges : petOptionsApi.ageRanges;
  const minField = isWeight ? "minKg" : "minMonths";
  const maxField = isWeight ? "maxKg" : "maxMonths";
  const unit = isWeight ? t("pages.petOptions.unitKg") : t("pages.petOptions.unitMonths");

  const tabs = (
    <div className="segmented-tabs" role="tablist" aria-label={t("pages.petOptions.title")}>
      <TabButton active={isWeight} onClick={() => setTab("weight")} icon={Ruler}>
        {t("pages.petOptions.weightTab")}
      </TabButton>
      <TabButton active={!isWeight} onClick={() => setTab("age")} icon={Timer}>
        {t("pages.petOptions.ageTab")}
      </TabButton>
    </div>
  );

  return (
    <ResourceManager
      key={tab}
      title={isWeight ? t("pages.petOptions.weightTitle") : t("pages.petOptions.ageTitle")}
      subtitle={isWeight ? t("pages.petOptions.weightSubtitle") : t("pages.petOptions.ageSubtitle")}
      headerActions={tabs}
      listApi={api.list}
      createApi={api.create}
      updateApi={api.update}
      deleteApi={api.remove}
      permissionMap={PERMISSIONS}
      searchPlaceholder={t("pages.petOptions.searchPlaceholder")}
      columns={[
        {
          key: "sortOrder",
          header: t("pages.petOptions.sortOrder"),
          render: (row) => <span className="order-cell">{row.sortOrder}</span>
        },
        { key: "label", header: t("pages.petOptions.label") },
        { key: "labelAr", header: t("pages.petOptions.labelAr"), render: (row) => row.labelAr || "-" },
        {
          key: "range",
          header: t("pages.petOptions.range"),
          render: (row) => <RangeCell min={row[minField]} max={row[maxField]} unit={unit} t={t} />
        },
        { key: "status", header: t("tables.status"), type: "status" }
      ]}
      formFields={[
        { name: "label", defaultValue: "" },
        { name: "labelAr", defaultValue: "" },
        { name: minField, defaultValue: "" },
        { name: maxField, defaultValue: "" },
        { name: "sortOrder", defaultValue: "0" },
        { name: "status", defaultValue: "ACTIVE" }
      ]}
      renderForm={({ form, setForm }) => (
        <PetOptionForm kind={tab} form={form} setForm={setForm} t={t} isRtl={isRtl} />
      )}
      mapRowToForm={(row) => ({
        label: row.label || "",
        labelAr: row.labelAr || "",
        [minField]: row[minField] == null ? "" : String(row[minField]),
        [maxField]: row[maxField] == null ? "" : String(row[maxField]),
        sortOrder: row.sortOrder == null ? "0" : String(row.sortOrder),
        status: row.status || "ACTIVE"
      })}
      preparePayload={(form) => ({
        label: form.label,
        labelAr: toText(form.labelAr),
        [minField]: toNumber(form[minField]),
        [maxField]: toNumber(form[maxField]),
        sortOrder: toNumber(form.sortOrder) ?? 0,
        status: form.status || "ACTIVE"
      })}
    />
  );
}

export default PetOptionsPage;
