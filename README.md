# Nex App Admin Dashboard

Production-ready Super Admin dashboard for the Nex App pet care loyalty platform.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Default API base:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Install and Run

```bash
cd dashboard
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Authentication

- Login endpoint: `POST /admin/auth/login`
- Profile endpoint: `GET /admin/auth/me`
- Logout endpoint: `POST /admin/auth/logout`

Seeded Super Admin:

- Email: `superadmin@nexapp.com`
- Password: `SuperAdmin@123`

## Main Modules

- Overview analytics dashboard
- Users + user details tabs (pets, scans, points, redemptions)
- Pets management
- Products CRUD + image/benefit/info management
- QR codes generation/list/export
- Points transactions + manual adjustments
- Rewards CRUD + clinic assignments
- Redeem codes verification and use flow
- Clinics / Doctors / Stores CRUD
- Notifications send + history
- Support conversations and replies
- Reports (users, products, scans, rewards, clinics, points)
- Admin users / roles / permission assignment
- System settings

## UX Features

- Protected routing
- Permission-based sidebar and page access
- Reusable tables/forms/modals
- Loading, empty, and error states
- Toast success/error feedback
- Responsive admin layout with collapsible sidebar
