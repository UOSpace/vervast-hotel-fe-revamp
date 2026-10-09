/**
 * Simple validation helper utilities
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(Number(value)) && value.trim() !== '';
  return false;
}
