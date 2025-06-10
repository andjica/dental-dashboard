export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch (e) {
    return null;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token && !!getUser();
}

export function getUserRole() {
  const user = getUser();
  return user?.role_id || null;
}

export function isEmailVerified() {
  const user = getUser();
  return !!user?.isVerify;
}