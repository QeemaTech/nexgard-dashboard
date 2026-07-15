import { useMemo } from "react";
import ResourceManager from "../../components/common/ResourceManager";
import storesApi from "../../api/storesApi";
import useTranslation from "../../hooks/useTranslation";
import useClinicOptions from "../../hooks/useClinicOptions";
import { formStatusOptions } from "../../utils/i18nHelpers";

function storeRowToForm(row = {}) {
  return {
    name: row.name || "",
    phone: row.phone || "",
    email: row.email || "",
    clinicId: row.clinicId || "",
    address: row.address || "",
    city: row.city || "",
    location: row.location || "",
    status: row.status || "ACTIVE"
  };
}

function StoresPage() {
  const { t } = useTranslation();
  const statusOptions = formStatusOptions(t);
  const clinics = useClinicOptions();
  const clinicSelectOptions = useMemo(
    () => [
      { value: "", label: t("tables.noClinicOptional") },
      ...clinics.map((clinic) => ({ value: clinic.id, label: clinic.name }))
    ],
    [clinics, t]
  );

  return (
    <ResourceManager
      title={t("pages.stores.title")}
      subtitle={t("pages.stores.subtitle")}
      listApi={storesApi.list}
      createApi={storesApi.create}
      updateApi={storesApi.update}
      deleteApi={storesApi.remove}
      permissionMap={{
        create: ["stores.create"],
        update: ["stores.update"],
        delete: ["stores.delete"]
      }}
      getDetailPath={(row) => `/app/stores/${row.id}`}
      mapRowToForm={storeRowToForm}
      columns={[
        { key: "name", header: t("tables.name") },
        { key: "email", header: t("tables.email") },
        { key: "phone", header: t("tables.phone") },
        { key: "city", header: t("tables.city") },
        { key: "clinicId", header: t("tables.clinicId") },
        { key: "status", header: t("tables.status"), type: "status" }
      ]}
      formFields={[
        { name: "name", label: t("tables.name") },
        { name: "phone", label: t("tables.phone") },
        { name: "email", label: t("tables.email"), type: "email" },
        { name: "clinicId", label: t("tables.clinic"), type: "select", options: clinicSelectOptions },
        { name: "address", label: t("tables.address"), type: "textarea" },
        { name: "city", label: t("tables.city") },
        { name: "location", label: t("tables.location") },
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

export default StoresPage;
