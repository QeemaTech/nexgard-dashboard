export const initialPetForm = {
  photo: "",
  name: "",
  type: "DOG",
  breed: "",
  gender: "UNKNOWN",
  age: "",
  weight: "",
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
    age: row.age == null ? "" : String(row.age),
    weight: row.weight == null ? "" : String(row.weight),
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
    age: form.age === "" ? null : Number(form.age),
    weight: form.weight === "" ? null : Number(form.weight),
    vetName: form.vetName || null,
    notes: form.notes || null,
    clinicId: form.clinicId || null
  };
}

export function getPetFormFields(t) {
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
    { name: "age", label: t("pages.petDetails.age"), type: "number" },
    { name: "weight", label: t("pages.petDetails.weight"), type: "number" },
    { name: "vetName", label: t("pages.petDetails.vetName") },
    { name: "notes", label: t("pages.petDetails.notes"), type: "textarea", className: "md:col-span-2" },
    { name: "clinicId", label: t("tables.clinicId"), className: "md:col-span-2" }
  ];
}
