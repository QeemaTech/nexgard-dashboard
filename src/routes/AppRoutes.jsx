import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import LogoutPage from "../pages/auth/LogoutPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import NotFoundPage from "../pages/auth/NotFoundPage";
import OverviewPage from "../pages/dashboard/OverviewPage";
import { lazyPage } from "../utils/lazyPage";

const UsersListPage = lazyPage(() => import("../pages/users/UsersListPage"), "nav.users");
const UserDetailsPage = lazyPage(() => import("../pages/users/UserDetailsPage"), "pages.userDetails.title");
const PetsListPage = lazyPage(() => import("../pages/pets/PetsListPage"), "nav.pets");
const PetDetailsPage = lazyPage(() => import("../pages/pets/PetDetailsPage"), "pages.petDetails.title");
const ProductsListPage = lazyPage(() => import("../pages/products/ProductsListPage"), "nav.products");
const ProductDetailsPage = lazyPage(() => import("../pages/products/ProductDetailsPage"), "pages.productDetails.title");
const QRCodesPage = lazyPage(() => import("../pages/qrcodes/QRCodesPage"), "nav.qrcodes");
const QRCodeDetailsPage = lazyPage(() => import("../pages/qrcodes/QRCodeDetailsPage"), "pages.qrcodeDetails.title");
const ScansPage = lazyPage(() => import("../pages/scans/ScansPage"), "nav.scans");
const ScanDetailsPage = lazyPage(() => import("../pages/scans/ScanDetailsPage"), "pages.scanDetails.title");
const PointsPage = lazyPage(() => import("../pages/points/PointsPage"), "nav.points");
const RewardsPage = lazyPage(() => import("../pages/rewards/RewardsPage"), "nav.rewards");
const RedemptionsPage = lazyPage(() => import("../pages/redemptions/RedemptionsPage"), "nav.redemptions");
const ClinicsPage = lazyPage(() => import("../pages/clinics/ClinicsPage"), "nav.clinics");
const ClinicDetailsPage = lazyPage(() => import("../pages/clinics/ClinicDetailsPage"), "pages.clinicDetails.title");
const DoctorsPage = lazyPage(() => import("../pages/doctors/DoctorsPage"), "nav.doctors");
const DoctorDetailsPage = lazyPage(() => import("../pages/doctors/DoctorDetailsPage"), "pages.doctorDetails.title");
const StoresPage = lazyPage(() => import("../pages/stores/StoresPage"), "nav.stores");
const StoreDetailsPage = lazyPage(() => import("../pages/stores/StoreDetailsPage"), "pages.storeDetails.title");
const NotificationsPage = lazyPage(() => import("../pages/notifications/NotificationsPage"), "nav.notifications");
const SupportPage = lazyPage(() => import("../pages/support/SupportPage"), "nav.support");
const UsersReportPage = lazyPage(() => import("../pages/reports/UsersReportPage"), "nav.reportsUsers");
const ProductsReportPage = lazyPage(() => import("../pages/reports/ProductsReportPage"), "nav.reportsProducts");
const ScansReportPage = lazyPage(() => import("../pages/reports/ScansReportPage"), "nav.reportsScans");
const RewardsReportPage = lazyPage(() => import("../pages/reports/RewardsReportPage"), "nav.reportsRewards");
const ClinicsReportPage = lazyPage(() => import("../pages/reports/ClinicsReportPage"), "nav.reportsClinics");
const PointsReportPage = lazyPage(() => import("../pages/reports/PointsReportPage"), "nav.reportsPoints");
const AdminUsersPage = lazyPage(() => import("../pages/roles/AdminUsersPage"), "nav.adminUsers");
const RolesPermissionsPage = lazyPage(() => import("../pages/roles/RolesPermissionsPage"), "nav.roles");
const SettingsPage = lazyPage(() => import("../pages/settings/SettingsPage"), "nav.settings");
const ProfilePage = lazyPage(() => import("../pages/profile/ProfilePage"), "pages.profile.title");

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/overview" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AdminLayout />}>
          <Route element={<ProtectedRoute requiredPermissions={["reports.view"]} />}>
            <Route path="overview" element={<OverviewPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["users.view"]} />}>
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/:id" element={<UserDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["pets.view"]} />}>
            <Route path="pets" element={<PetsListPage />} />
            <Route path="pets/:id" element={<PetDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["products.view"]} />}>
            <Route path="products" element={<ProductsListPage />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["qrcodes.view"]} />}>
            <Route path="qrcodes" element={<QRCodesPage />} />
            <Route path="qrcodes/:id" element={<QRCodeDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["scans.view"]} />}>
            <Route path="scans" element={<ScansPage />} />
            <Route path="scans/:id" element={<ScanDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["points.view"]} />}>
            <Route path="points" element={<PointsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["rewards.view"]} />}>
            <Route path="rewards" element={<RewardsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["redeem_codes.view"]} />}>
            <Route path="redemptions" element={<RedemptionsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["clinics.view"]} />}>
            <Route path="clinics" element={<ClinicsPage />} />
            <Route path="clinics/:id" element={<ClinicDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["doctors.view"]} />}>
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["stores.view"]} />}>
            <Route path="stores" element={<StoresPage />} />
            <Route path="stores/:id" element={<StoreDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["notifications.view"]} />}>
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["support.view"]} />}>
            <Route path="support" element={<SupportPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["reports.view"]} />}>
            <Route path="reports/users" element={<UsersReportPage />} />
            <Route path="reports/products" element={<ProductsReportPage />} />
            <Route path="reports/scans" element={<ScansReportPage />} />
            <Route path="reports/rewards" element={<RewardsReportPage />} />
            <Route path="reports/clinics" element={<ClinicsReportPage />} />
            <Route path="reports/points" element={<PointsReportPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["admin_users.view"]} />}>
            <Route path="admin-users" element={<AdminUsersPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["roles.view"]} />}>
            <Route path="roles" element={<RolesPermissionsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermissions={["settings.manage"]} />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage embedded />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
