import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Check,
  Gift,
  MapPin,
  PawPrint,
  Pencil,
  Phone,
  QrCode,
  Ticket,
  Wallet
} from "lucide-react";
import usersApi from "../../api/usersApi";
import useTranslation from "../../hooks/useTranslation";
import usePermissions from "../../hooks/usePermissions";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import UserEditForm from "../../components/users/UserEditForm";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import SpotlightCard from "../../components/motion/SpotlightCard";
import { BorderBeam, GlareHover } from "../../components/reactbits";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { tStatus } from "../../utils/i18nHelpers";
import { initialUserForm, userFormToPayload, userRowToForm } from "../../utils/userForm";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function InfoField({ label, children, value }) {
  return (
    <div className="detail-info-item">
      <p className="detail-info-label">{label}</p>
      <div className="detail-info-value">{children ?? value ?? "-"}</div>
    </div>
  );
}

function SignupField({ label, value, children, muted = false, full = false }) {
  return (
    <div className={`signup-field ${full ? "signup-field--full" : ""}`}>
      <span className="signup-field-label">{label}</span>
      {children !== undefined ? (
        <div className={`signup-field-value ${muted ? "signup-field-value--muted" : ""}`}>{children}</div>
      ) : (
        <div className={`signup-field-value ${muted || !value ? "signup-field-value--muted" : ""}`}>
          {value || "-"}
        </div>
      )}
    </div>
  );
}

function SocialLinkValue({ href }) {
  if (!href) return "-";

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="detail-link break-all">
      {href}
    </a>
  );
}

function UserDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasAnyPermission } = usePermissions();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("pets");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialUserForm);
  const canUpdate = hasAnyPermission(["users.update"]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await usersApi.getById(id);
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submitEdit(event) {
    event.preventDefault();
    if (!data) return;
    try {
      const response = await usersApi.update(data.id, userFormToPayload(form));
      setData((prev) => ({ ...prev, ...response.data.data }));
      toast.success(t("pages.users.updated"));
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openEdit() {
    setForm(userRowToForm(data));
    setEditing(true);
  }

  const wallet = data?.pointsWallet;

  const petsColumns = useMemo(
    () => [
      { key: "name", header: t("tables.petName") },
      { key: "type", header: t("tables.type"), render: (row) => tStatus(t, row.type) },
      { key: "breed", header: t("tables.breed"), render: (row) => row.breed || "-" },
      { key: "gender", header: t("tables.gender"), render: (row) => tStatus(t, row.gender) },
      { key: "age", header: t("tables.age"), render: (row) => (row.age != null ? row.age : "-") },
      { key: "weight", header: t("tables.weight"), render: (row) => (row.weight != null ? row.weight : "-") }
    ],
    [t]
  );

  const scansColumns = useMemo(
    () => [
      { key: "id", header: t("tables.id") },
      {
        key: "product",
        header: t("tables.product"),
        render: (row) => row.qrCode?.product?.name || "-"
      },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      {
        key: "points",
        header: t("tables.points"),
        render: (row) => row.qrCode?.pointsValue ?? row.qrCode?.product?.pointValue ?? 0
      },
      { key: "scannedAt", header: t("tables.date"), render: (row) => formatDateTime(row.scannedAt) }
    ],
    [t]
  );

  const pointsColumns = useMemo(
    () => [
      { key: "type", header: t("tables.type"), render: (row) => tStatus(t, row.type) },
      { key: "points", header: t("tables.points") },
      { key: "description", header: t("tables.description"), render: (row) => row.description || "-" },
      { key: "createdAt", header: t("tables.date"), render: (row) => formatDateTime(row.createdAt) }
    ],
    [t]
  );

  const redemptionsColumns = useMemo(
    () => [
      { key: "id", header: t("tables.id") },
      { key: "reward", header: t("tables.reward"), render: (row) => row.reward?.title || "-" },
      { key: "clinic", header: t("tables.clinic"), render: (row) => row.clinic?.name || "-" },
      { key: "pointsSpent", header: t("tables.points") },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      { key: "requestedAt", header: t("tables.date"), render: (row) => formatDateTime(row.requestedAt) }
    ],
    [t]
  );

  const tabs = useMemo(
    () => [
      { id: "pets", label: t("pages.userDetails.pets"), count: data?.pets?.length || 0, icon: PawPrint },
      { id: "scans", label: t("pages.userDetails.scans"), count: data?.scanTransactions?.length || 0, icon: QrCode },
      {
        id: "points",
        label: t("pages.userDetails.transactions"),
        count: data?.pointsTransactions?.length || 0,
        icon: Ticket
      },
      {
        id: "redemptions",
        label: t("pages.userDetails.redemptions"),
        count: data?.rewardRedemptions?.length || 0,
        icon: Gift
      }
    ],
    [data, t]
  );

  const emptyMessages = {
    pets: t("pages.userDetails.noPets"),
    scans: t("pages.userDetails.noScans"),
    points: t("pages.userDetails.noTransactions"),
    redemptions: t("pages.userDetails.noRedemptions")
  };

  const tabRows = {
    pets: data?.pets || [],
    scans: data?.scanTransactions || [],
    points: data?.pointsTransactions || [],
    redemptions: data?.rewardRedemptions || []
  };

  const tabColumns = {
    pets: petsColumns,
    scans: scansColumns,
    points: pointsColumns,
    redemptions: redemptionsColumns
  };

  return (
    <section>
      <PageHeader
        title={data?.fullName || t("pages.userDetails.title")}
        subtitle={t("pages.userDetails.subtitle")}
        actions={
          <div className="flex flex-wrap gap-2">
            {canUpdate && data ? (
              <Button variant="secondary" size="sm" onClick={openEdit}>
                <Pencil className="h-4 w-4" />
                {t("common.edit")}
              </Button>
            ) : null}
            <Button variant="secondary" size="sm" onClick={() => navigate("/app/users")}>
              <ArrowLeft className="h-4 w-4" />
              {t("pages.userDetails.backToUsers")}
            </Button>
          </div>
        }
      />
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && data ? (
        <Stagger className="detail-page space-y-5" stagger={0.07}>
          <StaggerItem>
            <BorderBeam className="rounded-[var(--radius-card)]">
              <SpotlightCard className="card-surface card-surface-interactive p-5 sm:p-6">
                <GlareHover className="rounded-[inherit]">
                  <div className="user-profile-hero">
                    <div className="user-avatar" aria-hidden="true">
                      {data.profileImage ? (
                        <img src={data.profileImage} alt={data.fullName} />
                      ) : (
                        getInitials(data.fullName)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="display-font text-2xl font-bold tracking-tight text-primary">{data.fullName}</h2>
                        <StatusBadge value={data.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted">{data.email}</p>
                      <div className="user-profile-meta">
                        {data.phone ? (
                          <span className="user-profile-meta-item">
                            <Phone className="h-3.5 w-3.5" />
                            {data.phone}
                          </span>
                        ) : null}
                        {data.city ? (
                          <span className="user-profile-meta-item">
                            <MapPin className="h-3.5 w-3.5" />
                            {data.city}
                          </span>
                        ) : null}
                        <span className="user-profile-meta-item">
                          <Calendar className="h-3.5 w-3.5" />
                          {t("pages.userDetails.memberSince")}: {formatDate(data.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlareHover>
              </SpotlightCard>
            </BorderBeam>
          </StaggerItem>

          <StaggerItem>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title={t("pages.userDetails.availablePoints")}
                value={wallet?.availablePoints ?? 0}
                icon={Wallet}
              />
              <StatCard
                title={t("pages.userDetails.totalEarned")}
                value={wallet?.totalEarnedPoints ?? 0}
                icon={Ticket}
              />
              <StatCard
                title={t("pages.userDetails.totalRedeemed")}
                value={wallet?.totalRedeemedPoints ?? 0}
                icon={Gift}
              />
              <StatCard
                title={t("pages.userDetails.totalExpired")}
                value={wallet?.totalExpiredPoints ?? 0}
                icon={Ticket}
              />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard title={t("pages.userDetails.pets")} value={data.pets?.length || 0} icon={PawPrint} />
              <StatCard
                title={t("pages.userDetails.scans")}
                value={data.scanTransactions?.length || 0}
                icon={QrCode}
              />
              <StatCard
                title={t("pages.userDetails.redemptions")}
                value={data.rewardRedemptions?.length || 0}
                icon={Gift}
              />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h3 className="detail-section-title">{t("pages.userDetails.registrationTitle")}</h3>
              <p className="signup-section-subtitle">{t("pages.userDetails.registrationSubtitle")}</p>

              <div className="signup-form-grid mt-5">
                <SignupField label={t("tables.fullName")} value={data.fullName} />
                <SignupField label={t("tables.email")} value={data.email} />
                <SignupField label={t("tables.phone")} value={data.phone} />
                <SignupField
                  label={t("pages.userDetails.password")}
                  value={t("pages.userDetails.passwordMasked")}
                  muted
                />
                <SignupField label={t("tables.city")} value={data.city} />
                <SignupField label={t("pages.userDetails.facebookLink")} muted={!data.facebookLink}>
                  <SocialLinkValue href={data.facebookLink} />
                </SignupField>
                <SignupField label={t("pages.userDetails.instagramLink")} muted={!data.instagramLink}>
                  <SocialLinkValue href={data.instagramLink} />
                </SignupField>

                <div className="signup-field signup-field--full">
                  <span className="signup-field-label">{t("pages.userDetails.termsAgreement")}</span>
                  <div className="signup-terms-row">
                    <span className="signup-terms-check" aria-hidden="true">
                      <Check className="h-3 w-3" />
                    </span>
                    <p className="signup-terms-text">
                      {t("pages.userDetails.termsAgreementLabel")}
                      <span className="ms-2 font-bold text-accent">
                        — {data.createdAt ? t("pages.userDetails.termsAccepted") : t("pages.userDetails.termsNotRecorded")}
                      </span>
                      {data.createdAt ? (
                        <span className="mt-1 block text-sm text-muted">{formatDateTime(data.createdAt)}</span>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h3 className="detail-section-title">{t("pages.userDetails.systemInfo")}</h3>
              <div className="detail-info-grid mt-5">
                <InfoField label={t("tables.id")} value={data.id} />
                <InfoField label={t("tables.status")}>
                  <StatusBadge value={data.status} />
                </InfoField>
                <InfoField label={t("tables.gender")} value={tStatus(t, data.gender)} />
                <InfoField label={t("pages.userDetails.dateOfBirth")} value={formatDate(data.dateOfBirth)} />
                <InfoField
                  label={t("pages.userDetails.emailVerified")}
                  value={data.emailVerifiedAt ? formatDateTime(data.emailVerifiedAt) : "-"}
                />
                <InfoField label={t("pages.userDetails.lastLogin")} value={formatDateTime(data.lastLoginAt)} />
                <InfoField label={t("pages.userDetails.memberSince")} value={formatDate(data.createdAt)} />
                <InfoField label={t("tables.date")} value={formatDateTime(data.createdAt)} />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h3 className="detail-section-title">{t("pages.userDetails.activity")}</h3>
              <div className="detail-tabs mt-4" role="tablist" aria-label={t("pages.userDetails.activity")}>
                {tabs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === item.id}
                      className={`detail-tab ${tab === item.id ? "detail-tab--active" : ""}`}
                      onClick={() => setTab(item.id)}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                        <span className="opacity-80">({item.count})</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4" role="tabpanel">
                {tabRows[tab]?.length ? (
                  <DataTable rows={tabRows[tab]} columns={tabColumns[tab]} />
                ) : (
                  <EmptyState title={emptyMessages[tab]} />
                )}
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      ) : null}

      <Modal isOpen={editing} title={t("pages.users.editTitle")} onClose={() => setEditing(false)}>
        <ModalForm
          onSubmit={submitEdit}
          onCancel={() => setEditing(false)}
          submitLabel={t("common.save")}
          cancelLabel={t("common.cancel")}
        >
          <UserEditForm form={form} setForm={setForm} t={t} />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default UserDetailsPage;
