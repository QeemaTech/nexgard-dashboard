import { Minus, Plus, Wand2 } from "lucide-react";
import FormInput from "../forms/FormInput";

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

function toArabicDigits(value) {
  return String(value).replace(/[0-9]/g, (digit) => ARABIC_DIGITS[Number(digit)]);
}

function isFilled(value) {
  return value !== "" && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

/** "2.5 - 5 kg" / "40 kg or more" — mirrors how the shipped defaults are worded */
function suggestWeightLabels(min, max) {
  if (!isFilled(min) && !isFilled(max)) return null;
  if (isFilled(min) && isFilled(max)) {
    return { label: `${min} - ${max} kg`, labelAr: `${toArabicDigits(min)} - ${toArabicDigits(max)} كجم` };
  }
  if (isFilled(min)) {
    return { label: `More than ${min} kg`, labelAr: `أكثر من ${toArabicDigits(min)} كجم` };
  }
  return { label: `Up to ${max} kg`, labelAr: `حتى ${toArabicDigits(max)} كجم` };
}

function monthsToParts(months) {
  const value = Number(months);
  if (value % 12 === 0 && value >= 12) {
    const years = value / 12;
    return { en: `${years} year${years > 1 ? "s" : ""}`, ar: `${toArabicDigits(years)} سنة`, years };
  }
  return { en: `${value} month${value > 1 ? "s" : ""}`, ar: `${toArabicDigits(value)} شهر`, years: null };
}

/** "6 months - 1 year" / "More than 5 years" */
function suggestAgeLabels(min, max) {
  if (!isFilled(min) && !isFilled(max)) return null;
  if (isFilled(min) && isFilled(max)) {
    const from = monthsToParts(min);
    const to = monthsToParts(max);
    // Both in years reads better as "1 - 2 years" than "1 year - 2 years"
    if (from.years && to.years) {
      return {
        label: `${from.years} - ${to.years} years`,
        labelAr: `${toArabicDigits(from.years)} - ${toArabicDigits(to.years)} سنوات`
      };
    }
    return { label: `${from.en} - ${to.en}`, labelAr: `${from.ar} - ${to.ar}` };
  }
  if (isFilled(min)) {
    const from = monthsToParts(min);
    return { label: `More than ${from.en}`, labelAr: `أكثر من ${from.ar}` };
  }
  const to = monthsToParts(max);
  return { label: `Up to ${to.en}`, labelAr: `حتى ${to.ar}` };
}

function RangeInput({ label, value, suffix, onChange, ...props }) {
  return (
    <label className="form-field block">
      <span className="form-label mb-2 block">{label}</span>
      <div className="input-with-suffix">
        <input
          type="number"
          className="input-field"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
        <span className="input-suffix">{suffix}</span>
      </div>
    </label>
  );
}

function StatusToggle({ value, onChange, activeLabel, inactiveLabel, label }) {
  return (
    <div className="form-field">
      <span className="form-label mb-2 block">{label}</span>
      <div className="status-toggle" role="group">
        {[
          { key: "ACTIVE", text: activeLabel },
          { key: "INACTIVE", text: inactiveLabel }
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`status-toggle-option ${
              value === option.key ? `status-toggle-option--${option.key.toLowerCase()}` : ""
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function PetOptionForm({ kind, form, setForm, t, isRtl }) {
  const isWeight = kind === "weight";
  const minField = isWeight ? "minKg" : "minMonths";
  const maxField = isWeight ? "maxKg" : "maxMonths";
  const unit = isWeight ? t("pages.petOptions.unitKg") : t("pages.petOptions.unitMonths");

  const suggestion = isWeight
    ? suggestWeightLabels(form[minField], form[maxField])
    : suggestAgeLabels(form[minField], form[maxField]);

  function set(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function applySuggestion() {
    if (!suggestion) return;
    setForm((prev) => ({ ...prev, label: suggestion.label, labelAr: suggestion.labelAr }));
  }

  function stepOrder(delta) {
    const next = Math.max(0, (Number(form.sortOrder) || 0) + delta);
    set("sortOrder", String(next));
  }

  const previewLabel = (isRtl && form.labelAr) || form.label || t("pages.petOptions.previewEmpty");

  return (
    <>
      <div className="md:col-span-2">
        <p className="form-section-title">{t("pages.petOptions.rangeSection")}</p>
        <p className="form-section-hint">
          {isWeight ? t("pages.petOptions.rangeHintWeight") : t("pages.petOptions.rangeHintAge")}
        </p>
      </div>

      <RangeInput
        label={t("pages.petOptions.from")}
        value={form[minField]}
        suffix={unit}
        min="0"
        step={isWeight ? "0.1" : "1"}
        placeholder={isWeight ? "2.5" : "6"}
        onChange={(value) => set(minField, value)}
      />
      <RangeInput
        label={t("pages.petOptions.to")}
        value={form[maxField]}
        suffix={unit}
        min="0"
        step={isWeight ? "0.1" : "1"}
        placeholder={t("pages.petOptions.noLimit")}
        onChange={(value) => set(maxField, value)}
      />

      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
        <p className="form-section-title !mb-0">{t("pages.petOptions.labelsSection")}</p>
        {suggestion ? (
          <button type="button" className="link-button" onClick={applySuggestion}>
            <Wand2 className="h-3.5 w-3.5" />
            {t("pages.petOptions.generateFromRange")}
          </button>
        ) : null}
      </div>

      <FormInput
        label={t("pages.petOptions.label")}
        value={form.label ?? ""}
        placeholder={suggestion?.label || "2.5 - 5 kg"}
        onChange={(event) => set("label", event.target.value)}
      />
      <FormInput
        label={t("pages.petOptions.labelAr")}
        value={form.labelAr ?? ""}
        placeholder={suggestion?.labelAr || "٢.٥ - ٥ كجم"}
        onChange={(event) => set("labelAr", event.target.value)}
      />

      <div className="form-field">
        <span className="form-label mb-2 block">{t("pages.petOptions.sortOrder")}</span>
        <div className="stepper">
          <button
            type="button"
            className="stepper-btn"
            onClick={() => stepOrder(-1)}
            aria-label={t("pages.petOptions.decreaseOrder")}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="0"
            className="input-field stepper-input"
            value={form.sortOrder ?? "0"}
            onChange={(event) => set("sortOrder", event.target.value)}
          />
          <button
            type="button"
            className="stepper-btn"
            onClick={() => stepOrder(1)}
            aria-label={t("pages.petOptions.increaseOrder")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="mt-2 block text-xs text-muted">{t("pages.petOptions.sortOrderHint")}</span>
      </div>

      <StatusToggle
        label={t("tables.status")}
        value={form.status || "ACTIVE"}
        onChange={(value) => set("status", value)}
        activeLabel={t("status.ACTIVE")}
        inactiveLabel={t("status.INACTIVE")}
      />

      <div className="md:col-span-2">
        <div className="option-preview">
          <span className="option-preview-label">{t("pages.petOptions.preview")}</span>
          <div className="option-preview-select">
            <span className={form.label || form.labelAr ? "" : "text-muted"}>{previewLabel}</span>
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default PetOptionForm;
