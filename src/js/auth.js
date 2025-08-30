// export const getUserRole = () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.role_id;
//   } catch (e) {
//     return null;
//   }
// };

// export const isAuthenticated = () => {
//   return !!localStorage.getItem("user");
// };


// export const isEmailVerified = () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.email_verified_at !== null;
//   } catch (e) {
//     return false;
//   }
// };

// auth.js

export const getUserRole = () => {
  try {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return null;
    const user = JSON.parse(userRaw);

    // ako nema role → null; ako ima → broj
    return user?.role_id == null ? null : Number(user.role_id);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  // bolje proveri TOKEN, ne samo user
  const token = localStorage.getItem("token");
  return !!token;
};

export const isEmailVerified = () => {
  try {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return false;
    const user = JSON.parse(userRaw);

    // tretiramo null/undefined/"" kao neverifikovano
    return !!user?.email_verified_at;
  } catch {
    return false;
  }
};
