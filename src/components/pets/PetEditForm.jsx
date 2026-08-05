import FormInput from "../forms/FormInput";
import SelectInput from "../forms/SelectInput";
import TextArea from "../forms/TextArea";
import { formGenderOptions, formPetTypeOptions } from "../../utils/i18nHelpers";
import { rangeSelectOptions } from "../../utils/petForm";

function PetEditForm({ form, setForm, t, weightOptions = [], ageOptions = [] }) {
  return (
    <>
      <FormInput
        label={t("pages.petDetails.petPhoto")}
        className="md:col-span-2"
        value={form.photo}
        onChange={(event) => setForm((prev) => ({ ...prev, photo: event.target.value }))}
      />
      <FormInput
        label={t("pages.petDetails.petName")}
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
      />
      <SelectInput
        label={t("pages.petDetails.petType")}
        value={form.type}
        onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
        options={formPetTypeOptions(t)}
      />
      <FormInput
        label={t("pages.petDetails.breed")}
        value={form.breed}
        onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
      />
      <SelectInput
        label={t("pages.petDetails.gender")}
        value={form.gender}
        onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
        options={formGenderOptions(t)}
      />
      <SelectInput
        label={t("pages.petDetails.age")}
        value={form.ageRangeId}
        onChange={(event) => setForm((prev) => ({ ...prev, ageRangeId: event.target.value }))}
        options={rangeSelectOptions(t, ageOptions)}
      />
      <SelectInput
        label={t("pages.petDetails.weight")}
        value={form.weightRangeId}
        onChange={(event) => setForm((prev) => ({ ...prev, weightRangeId: event.target.value }))}
        options={rangeSelectOptions(t, weightOptions)}
      />
      <FormInput
        label={t("pages.petDetails.vetName")}
        value={form.vetName}
        onChange={(event) => setForm((prev) => ({ ...prev, vetName: event.target.value }))}
      />
      <TextArea
        label={t("pages.petDetails.notes")}
        className="md:col-span-2"
        rows={3}
        value={form.notes}
        onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
      />
      <FormInput
        label={t("tables.clinicId")}
        className="md:col-span-2"
        value={form.clinicId}
        onChange={(event) => setForm((prev) => ({ ...prev, clinicId: event.target.value }))}
      />
    </>
  );
}

export default PetEditForm;
