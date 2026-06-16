import { useMemo } from "react";
import ResourceManager from "../../components/common/ResourceManager";
import petsApi from "../../api/petsApi";
import StatusBadge from "../../components/common/StatusBadge";
import useTranslation from "../../hooks/useTranslation";
import { getPetFormFields, petFormToPayload, petRowToForm } from "../../utils/petForm";

function PetsListPage() {
  const { t } = useTranslation();
  const formFields = useMemo(() => getPetFormFields(t), [t]);

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
      getDetailPath={(row) => `/app/pets/${row.id}`}
      mapRowToForm={petRowToForm}
      preparePayload={petFormToPayload}
      columns={[
        { key: "name", header: t("tables.name") },
        { key: "type", header: t("tables.type") },
        { key: "gender", header: t("tables.gender") },
        { key: "age", header: t("tables.age") },
        { key: "user", header: t("tables.user"), render: (row) => row.user?.fullName || "-" },
        { key: "status", header: t("tables.status"), render: () => <StatusBadge value="ACTIVE" /> }
      ]}
      formFields={formFields}
      searchPlaceholder={t("common.search")}
    />
  );
}

export default PetsListPage;
