import ResourceManager from "../../components/common/ResourceManager";
import doctorsApi from "../../api/doctorsApi";
import useTranslation from "../../hooks/useTranslation";
import { formStatusOptions } from "../../utils/i18nHelpers";

function DoctorsPage() {
  const { t } = useTranslation();
  const statusOptions = formStatusOptions(t);

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
        { name: "clinicId", label: t("tables.clinicId") },
        { name: "specialization", label: t("tables.specialization") },
        {
          name: "status",
          label: t("tables.status"),
          type: "select",
          defaultValue: "ACTIVE",
          options: statusOptions
        }
      ]}
      searchPlaceholder={t("common.search")}
    />
  );
}

export default DoctorsPage;
