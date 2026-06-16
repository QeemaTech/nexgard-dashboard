import FormInput from "../forms/FormInput";
import SelectInput from "../forms/SelectInput";
import { formGenderOptions, formStatusOptions } from "../../utils/i18nHelpers";

function UserEditForm({ form, setForm, t }) {
  return (
    <>
      <FormInput
        label={t("tables.fullName")}
        value={form.fullName}
        onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
      />
      <FormInput
        label={t("tables.email")}
        type="email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
      />
      <FormInput
        label={t("tables.phone")}
        value={form.phone}
        onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
      />
      <FormInput
        label={t("tables.city")}
        value={form.city}
        onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
      />
      <SelectInput
        label={t("tables.gender")}
        value={form.gender}
        onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
        options={formGenderOptions(t)}
      />
      <FormInput
        label={t("pages.userDetails.dateOfBirth")}
        type="date"
        value={form.dateOfBirth}
        onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
      />
      <SelectInput
        label={t("tables.status")}
        value={form.status}
        onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
        options={formStatusOptions(t)}
      />
      <FormInput
        label={t("pages.userDetails.facebookLink")}
        className="md:col-span-2"
        value={form.facebookLink}
        onChange={(event) => setForm((prev) => ({ ...prev, facebookLink: event.target.value }))}
      />
      <FormInput
        label={t("pages.userDetails.instagramLink")}
        className="md:col-span-2"
        value={form.instagramLink}
        onChange={(event) => setForm((prev) => ({ ...prev, instagramLink: event.target.value }))}
      />
      <FormInput
        label={t("pages.userDetails.profileImage")}
        className="md:col-span-2"
        value={form.profileImage}
        onChange={(event) => setForm((prev) => ({ ...prev, profileImage: event.target.value }))}
      />
    </>
  );
}

export default UserEditForm;
