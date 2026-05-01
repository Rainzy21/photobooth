const SESSION_KEY = "photobooth_admin_auth";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function loginAdmin(password: string): boolean {
  const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin1234";
  if (password === correct) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
