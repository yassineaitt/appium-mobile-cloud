/** The demo app accepts any syntactically valid email with a password of 8+ chars. */
export const users = {
  valid: { email: 'qa.lead@example.com', password: 'Str0ngPassw0rd!' },
  invalidEmail: { email: 'not-an-email', password: 'Str0ngPassw0rd!' },
  shortPassword: { email: 'qa.lead@example.com', password: 'short' },
} as const;

export const messages = {
  loggedIn: 'You are logged in!',
  signedUp: 'You successfully signed up!',
  invalidEmail: 'Please enter a valid email address',
  shortPassword: 'Please enter at least 8 characters',
  passwordMismatch: 'Please enter the same password',
  activeButtonAlert: 'This button is active',
} as const;
