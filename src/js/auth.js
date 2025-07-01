export const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role_id;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};


export const isEmailVerified = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.email_verified_at !== null;
  } catch (e) {
    return false;
  }
};