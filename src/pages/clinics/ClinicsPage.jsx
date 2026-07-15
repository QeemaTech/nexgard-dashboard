import ResourceManager from "../../components/common/ResourceManager";
import clinicsApi from "../../api/clinicsApi";
import useTranslation from "../../hooks/useTranslation";
import { formStatusOptions } from "../../utils/i18nHelpers";

function ClinicsPage() {
  const { t } = useTranslation();
  const statusOptions = formStatusOptions(t);

  return (
    <ResourceManager
      title={t("pages.clinics.title")}
      subtitle={t("pages.clinics.subtitle")}
      listApi={clinicsApi.list}
      createApi={clinicsApi.create}
      updateApi={clinicsApi.update}
      deleteApi={clinicsApi.remove}
      permissionMap={{
        create: ["clinics.create"],
        update: ["clinics.update"],
        delete: ["clinics.delete"]
      }}
      getDetailPath={(row) => `/app/clinics/${row.id}`}
      columns={[
        { key: "name", header: t("tables.name") },
        { key: "phone", header: t("tables.phone") },
        { key: "email", header: t("tables.email") },
        { key: "city", header: t("tables.city") },
        { key: "status", header: t("tables.status"), type: "status" }
      ]}
      formFields={[
        { name: "name", label: t("tables.name") },
        { name: "phone", label: t("tables.phone") },
        { name: "email", label: t("tables.email"), type: "email" },
        { name: "address", label: t("tables.address"), type: "textarea" },
        { name: "city", label: t("tables.city") },
        { name: "location", label: t("tables.location") },
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
          hint: t("pages.clinics.passwordHint"),
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

export default ClinicsPage;
