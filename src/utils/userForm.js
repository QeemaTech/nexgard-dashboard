export const initialUserForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  status: "ACTIVE",
  gender: "UNKNOWN",
  dateOfBirth: "",
  facebookLink: "",
  instagramLink: "",
  profileImage: ""
};

export function userRowToForm(row = {}) {
  return {
    fullName: row.fullName || "",
    email: row.email || "",
    phone: row.phone || "",
    city: row.city || "",
    status: row.status || "ACTIVE",
    gender: row.gender || "UNKNOWN",
    dateOfBirth: row.dateOfBirth ? String(row.dateOfBirth).slice(0, 10) : "",
    facebookLink: row.facebookLink || "",
    instagramLink: row.instagramLink || "",
    profileImage: row.profileImage || ""
  };
}

export function userFormToPayload(form) {
  return {
    ...form,
    phone: form.phone || null,
    city: form.city || null,
    dateOfBirth: form.dateOfBirth || null,
    facebookLink: form.facebookLink || null,
    instagramLink: form.instagramLink || null,
    profileImage: form.profileImage || null
  };
}
