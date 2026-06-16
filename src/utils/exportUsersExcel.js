function mapUserRow(user) {
  return {
    ID: user.id,
    "Full Name": user.fullName || "",
    Email: user.email || "",
    Phone: user.phone || "",
    City: user.city || "",
    Gender: user.gender || "",
    Status: user.status || "",
    "Available Points": user.pointsWallet?.availablePoints ?? 0,
    "Total Earned": user.pointsWallet?.totalEarnedPoints ?? 0,
    "Total Redeemed": user.pointsWallet?.totalRedeemedPoints ?? 0,
    "Total Expired": user.pointsWallet?.totalExpiredPoints ?? 0,
    "Facebook Link": user.facebookLink || "",
    "Instagram Link": user.instagramLink || "",
    "Email Verified At": user.emailVerifiedAt || "",
    "Last Login At": user.lastLoginAt || "",
    "Created At": user.createdAt || ""
  };
}

export async function fetchAllUsers(usersApi, filters = {}) {
  const all = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await usersApi.list({
      ...filters,
      page,
      limit: 100
    });
    const rows = response.data.data || [];
    const meta = response.data.pagination || response.data.meta || {};
    all.push(...rows);
    totalPages = meta.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export function downloadUsersExcelBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadUsersExcel(users, filename) {
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.json_to_sheet(users.map(mapUserRow));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Users");
  XLSX.writeFile(workbook, filename);
}

export async function exportUsersExcelClient(usersApi, filters = {}) {
  const users = await fetchAllUsers(usersApi, filters);
  const filename = `users-${new Date().toISOString().slice(0, 10)}.xlsx`;
  await downloadUsersExcel(users, filename);
  return users.length;
}
