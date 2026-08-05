export const initialPetForm = {
  photo: "",
  name: "",
  type: "DOG",
  breed: "",
  gender: "UNKNOWN",
  ageRangeId: "",
  weightRangeId: "",
  vetName: "",
  notes: "",
  clinicId: ""
};

export function petRowToForm(row = {}) {
  return {
    photo: row.photo || "",
    name: row.name || "",
    type: row.type || "DOG",
    breed: row.breed || "",
    gender: row.gender || "UNKNOWN",
    ageRangeId: row.ageRangeId || "",
    weightRangeId: row.weightRangeId || "",
    vetName: row.vetName || "",
    notes: row.notes || "",
    clinicId: row.clinicId || ""
  };
}

export function petFormToPayload(form) {
  return {
    photo: form.photo || null,
    name: form.name,
    type: form.type,
    breed: form.breed || null,
    gender: form.gender || "UNKNOWN",
    ageRangeId: form.ageRangeId || null,
    weightRangeId: form.weightRangeId || null,
    vetName: form.vetName || null,
    notes: form.notes || null,
    clinicId: form.clinicId || null
  };
}

/** Prepends a blank entry so an already-set range can be cleared again */
export function rangeSelectOptions(t, options = []) {
  return [{ label: t("common.notSelected"), value: "" }, ...options];
}

export function getPetFormFields(t, { weightOptions = [], ageOptions = [] } = {}) {
  return [
    { name: "photo", label: t("pages.petDetails.petPhoto"), className: "md:col-span-2" },
    { name: "name", label: t("pages.petDetails.petName") },
    {
      name: "type",
      label: t("pages.petDetails.petType"),
      type: "select",
      options: [
        { label: t("status.DOG"), value: "DOG" },
        { label: t("status.CAT"), value: "CAT" },
        { label: t("status.OTHER"), value: "OTHER" }
      ]
    },
    { name: "breed", label: t("pages.petDetails.breed") },
    {
      name: "gender",
      label: t("pages.petDetails.gender"),
      type: "select",
      options: [
        { label: t("status.MALE"), value: "MALE" },
        { label: t("status.FEMALE"), value: "FEMALE" },
        { label: t("status.UNKNOWN"), value: "UNKNOWN" }
      ]
    },
    {
      name: "ageRangeId",
      label: t("pages.petDetails.age"),
      type: "select",
      options: rangeSelectOptions(t, ageOptions)
    },
    {
      name: "weightRangeId",
      label: t("pages.petDetails.weight"),
      type: "select",
      options: rangeSelectOptions(t, weightOptions)
    },
    { name: "vetName", label: t("pages.petDetails.vetName") },
    { name: "notes", label: t("pages.petDetails.notes"), type: "textarea", className: "md:col-span-2" },
    { name: "clinicId", label: t("tables.clinicId"), className: "md:col-span-2" }
  ];
}
