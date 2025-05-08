/**
 * Core login business logic, separated from the API route handler
 * This makes it independently testable and reusable
 */
export function logoutUser() {
  // Return the cookie settings needed to clear the session
  return {
    cookieSetting:
      'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
  };
}
