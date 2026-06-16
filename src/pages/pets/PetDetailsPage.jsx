import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, PawPrint, UserRound } from "lucide-react";
import petsApi from "../../api/petsApi";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import SpotlightCard from "../../components/motion/SpotlightCard";
import { BorderBeam, GlareHover } from "../../components/reactbits";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { tStatus } from "../../utils/i18nHelpers";

function DetailField({ label, value, children, muted = false, full = false }) {
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

function InfoField({ label, children, value }) {
  return (
    <div className="detail-info-item">
      <p className="detail-info-label">{label}</p>
      <div className="detail-info-value">{children ?? value ?? "-"}</div>
    </div>
  );
}

function GenderPills({ value, t }) {
  const options = ["MALE", "FEMALE"];

  return (
    <div className="gender-pills" role="group" aria-label={t("tables.gender")}>
      {options.map((option) => {
        const active = value === option;
        return (
          <span
            key={option}
            className={`gender-pill ${active ? "gender-pill--active" : "gender-pill--inactive"}`}
          >
            {tStatus(t, option)}
          </span>
        );
      })}
      {value === "UNKNOWN" ? (
        <span className="gender-pill gender-pill--inactive">{tStatus(t, "UNKNOWN")}</span>
      ) : null}
    </div>
  );
}

function PetDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await petsApi.getById(id);
        setData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const ageLabel =
    data?.age != null
      ? t("pages.petDetails.ageYears", { count: data.age })
      : "-";

  const weightLabel =
    data?.weight != null
      ? t("pages.petDetails.weightValue", { value: data.weight })
      : "-";

  return (
    <section>
      <PageHeader
        title={data?.name || t("pages.petDetails.title")}
        subtitle={t("pages.petDetails.subtitle")}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate("/app/pets")}>
            <ArrowLeft className="h-4 w-4" />
            {t("pages.petDetails.backToPets")}
          </Button>
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
                    <div className="pet-photo-preview" aria-hidden="true">
                      {data.photo ? (
                        <img src={data.photo} alt={data.name} />
                      ) : (
                        <span className="pet-photo-placeholder">
                          <PawPrint className="h-8 w-8" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="display-font text-2xl font-bold tracking-tight text-primary">{data.name}</h2>
                        <StatusBadge value={data.type} />
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {tStatus(t, data.type)}
                        {data.breed ? ` · ${data.breed}` : ""}
                      </p>
                      <div className="user-profile-meta">
                        {data.user ? (
                          <button
                            type="button"
                            className="user-profile-meta-item detail-link border-0 bg-transparent p-0"
                            onClick={() => navigate(`/app/users/${data.user.id}`)}
                          >
                            <UserRound className="h-3.5 w-3.5" />
                            {data.user.fullName}
                          </button>
                        ) : null}
                        <span className="user-profile-meta-item">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(data.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlareHover>
              </SpotlightCard>
            </BorderBeam>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h3 className="detail-section-title">{t("pages.petDetails.addPetTitle")}</h3>
              <p className="signup-section-subtitle">{t("pages.petDetails.addPetSubtitle")}</p>

              <div className="signup-form-grid mt-5">
                <div className="signup-field signup-field--full">
                  <span className="signup-field-label">{t("pages.petDetails.petPhoto")}</span>
                  <div className="pet-photo-field">
                    {data.photo ? (
                      <img src={data.photo} alt={data.name} className="pet-photo-field-image" />
                    ) : (
                      <div className="pet-photo-field-empty">
                        <PawPrint className="h-6 w-6 text-muted" />
                        <span>{t("pages.petDetails.noPhoto")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <DetailField label={t("pages.petDetails.petName")} value={data.name} />
                <DetailField label={t("pages.petDetails.petType")} value={tStatus(t, data.type)} />
                <DetailField label={t("pages.petDetails.breed")} value={data.breed} />
                <DetailField label={t("pages.petDetails.gender")}>
                  <GenderPills value={data.gender} t={t} />
                </DetailField>
                <DetailField label={t("pages.petDetails.age")} value={ageLabel} muted={data.age == null} />
                <DetailField label={t("pages.petDetails.weight")} value={weightLabel} muted={data.weight == null} />
                <DetailField label={t("pages.petDetails.vetName")} value={data.vetName} muted={!data.vetName} />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h3 className="detail-section-title">{t("pages.petDetails.systemInfo")}</h3>
              <div className="detail-info-grid mt-5">
                <InfoField label={t("tables.id")} value={data.id} />
                <InfoField label={t("pages.petDetails.owner")}>
                  {data.user ? (
                    <button
                      type="button"
                      className="detail-link border-0 bg-transparent p-0 font-semibold"
                      onClick={() => navigate(`/app/users/${data.user.id}`)}
                    >
                      {data.user.fullName}
                    </button>
                  ) : (
                    "-"
                  )}
                </InfoField>
                <InfoField label={t("tables.email")} value={data.user?.email} />
                <InfoField label={t("tables.phone")} value={data.user?.phone} />
                <InfoField label={t("tables.clinic")} value={data.clinic?.name} />
                <InfoField label={t("pages.petDetails.notes")} value={data.notes} />
                <InfoField label={t("tables.date")} value={formatDateTime(data.createdAt)} />
                <InfoField label={t("pages.petDetails.updatedAt")} value={formatDateTime(data.updatedAt)} />
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      ) : null}
    </section>
  );
}

export default PetDetailsPage;
