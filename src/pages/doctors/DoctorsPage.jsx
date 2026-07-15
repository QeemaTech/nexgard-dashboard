import { useMemo } from "react";
import ResourceManager from "../../components/common/ResourceManager";
import doctorsApi from "../../api/doctorsApi";
import useTranslation from "../../hooks/useTranslation";
import useClinicOptions from "../../hooks/useClinicOptions";
import { formStatusOptions } from "../../utils/i18nHelpers";

function doctorRowToForm(row = {}) {
  return {
    name: row.name || "",
    phone: row.phone || "",
    email: row.email || "",
    clinicId: row.clinicId || "",
    specialization: row.specialization || "",
    status: row.status || "ACTIVE"
  };
}

function DoctorsPage() {
  const { t } = useTranslation();
  const statusOptions = formStatusOptions(t);
  const clinics = useClinicOptions();
  const clinicSelectOptions = useMemo(
    () => [
      { value: "", label: t("tables.selectClinic") },
      ...clinics.map((clinic) => ({ value: clinic.id, label: clinic.name }))
    ],
    [clinics, t]
  );

  return (
    <ResourceManager
      title={t("pages.doctors.title")}
      subtitle={t("pages.doctors.subtitle")}
      listApi={doctorsApi.list}
      createApi={doctorsApi.create}
      updateApi={doctorsApi.update}
      deleteApi={doctorsApi.remove}
      permissionMap={{
        create: ["doctors.create"],
        update: ["doctors.update"],
        delete: ["doctors.delete"]
      }}
      getDetailPath={(row) => `/app/doctors/${row.id}`}
      mapRowToForm={doctorRowToForm}
      columns={[
        { key: "name", header: t("tables.name") },
        { key: "email", header: t("tables.email") },
        { key: "phone", header: t("tables.phone") },
        { key: "specialization", header: t("tables.specialization") },
        { key: "clinicId", header: t("tables.clinicId") },
        { key: "status", header: t("tables.status"), type: "status" }
      ]}
      formFields={[
        { name: "name", label: t("tables.name") },
        { name: "phone", label: t("tables.phone") },
        { name: "email", label: t("tables.email"), type: "email" },
        { name: "clinicId", label: t("tables.clinic"), type: "select", options: clinicSelectOptions },
        { name: "specialization", label: t("tables.specialization") },
        {
          name: "status",
          label: t("tables.status"),
          type: "select",
          defaultValue: "ACTIVE",
          options: statusOptions
        },
        {
          name: "password",
          label: t("pages.adminUsers.password"),
          type: "password",
          hint: t("pages.doctors.passwordHint"),
          hideOnEdit: true
        }
      ]}
      preparePayload={(form) => {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        return payload;
      }}
      searchPlaceholder={t("common.search")}
    />
  );
}

export default DoctorsPage;
