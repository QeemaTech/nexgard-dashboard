import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import BrandLoader from "../../components/common/BrandLoader";
import LoginSuccessOverlay from "../../components/auth/LoginSuccessOverlay";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email) nextErrors.email = t("auth.emailRequired");
    if (!form.password) nextErrors.password = t("auth.passwordRequired");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(form);
      setShowSuccess(true);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  function handleSuccessComplete() {
    navigate("/app/overview", { replace: true });
  }

  function fillDemoCredentials() {
    setForm({
      email: "superadmin@nexapp.com",
      password: "SuperAdmin@123"
    });
    setErrors({});
  }

  if (loading && !showSuccess) {
    return (
      <div className="auth-login-loading py-10">
        <BrandLoader variant="compact" label={t("auth.signingIn")} />
      </div>
    );
  }

  return (
    <>
      {showSuccess ? <LoginSuccessOverlay onComplete={handleSuccessComplete} /> : null}

      <div className={showSuccess ? "pointer-events-none opacity-0" : "auth-form-enter"}>
        <div className="auth-form-intro">
          <h1 className="display-font text-2xl font-extrabold tracking-tight text-primary">
            {t("auth.loginTitle")}
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-muted">{t("auth.loginSubtitle")}</p>
        </div>

        <form className="auth-form mt-8 grid gap-5" onSubmit={handleSubmit}>
          <FormInput
            label={t("auth.email")}
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={form.email}
            error={errors.email}
            icon={Mail}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <FormInput
            label={t("auth.password")}
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            icon={LockKeyhole}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <Button type="submit" disabled={loading} className="auth-submit mt-2 w-full py-4 uppercase tracking-widest">
            {t("auth.signIn")}
          </Button>
        </form>

        <button
          type="button"
          onClick={fillDemoCredentials}
          className="auth-demo-hint mt-6 w-full rounded-xl border border-dashed px-4 py-3 text-left text-xs transition"
        >
          <span className="block font-bold uppercase tracking-wider text-accent">Demo access</span>
          <span className="mt-1 block text-muted">superadmin@nexapp.com · SuperAdmin@123</span>
        </button>
      </div>
    </>
  );
}

export default LoginPage;
