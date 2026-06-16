import ResourceManager from "../../components/common/ResourceManager";
import petsApi from "../../api/petsApi";
import StatusBadge from "../../components/common/StatusBadge";
import useTranslation from "../../hooks/useTranslation";
import { formGenderOptions, formPetTypeOptions } from "../../utils/i18nHelpers";

function PetsListPage() {
  const { t } = useTranslation();

  return (
    <ResourceManager
      title={t("pages.pets.title")}
      subtitle={t("pages.pets.subtitle")}
      listApi={petsApi.list}
      createApi={() => Promise.resolve()}
      updateApi={petsApi.update}
      deleteApi={petsApi.remove}
      disableCreate
      permissionMap={{
        update: ["pets.manage"],
        delete: ["pets.manage"]
      }}
      columns={[
        { key: "name", header: t("tables.name") },
        { key: "type", header: t("tables.type") },
        { key: "gender", header: t("tables.gender") },
        { key: "age", header: t("tables.age") },
        { key: "user", header: t("tables.user"), render: (row) => row.user?.fullName || "-" },
        { key: "status", header: t("tables.status"), render: () => <StatusBadge value="ACTIVE" /> }
      ]}
      formFields={[
        { name: "name", label: t("tables.name") },
        {
          name: "type",
          label: t("tables.type"),
          type: "select",
          options: formPetTypeOptions(t)
        },
        {
          name: "gender",
          label: t("tables.gender"),
          type: "select",
          options: formGenderOptions(t)
        },
        { name: "age", label: t("tables.age"), type: "number" },
        { name: "weight", label: t("tables.weight"), type: "number" },
        { name: "breed", label: t("tables.breed") },
        { name: "vetName", label: t("tables.vetName") },
        { name: "clinicId", label: t("tables.clinicId") }
      ]}
      searchPlaceholder={t("common.search")}
    />
  );
}

export default PetsListPage;
