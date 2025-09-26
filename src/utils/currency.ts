/**
 * Format currency value for display
 * @param value - Numeric value or string with currency symbol
 * @returns Formatted currency string
 */
export function formatCurrency(value: string | number): string {
  if (typeof value === 'string') {
    // If already formatted with £ symbol, return as is
    if (value.startsWith('£')) {
      return value;
    }
    // Try to parse numeric value from string
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return value; // Return original if not a number
    }
    return `£${numericValue.toFixed(2)}`;
  }

  // Format numeric value
  return `£${value.toFixed(2)}`;
}

/**
 * Parse currency string to numeric value
 * @param currencyString - Currency string (e.g., "£85.00")
 * @returns Numeric value or null if invalid
 */
export function parseCurrency(currencyString: string): number | null {
  // Remove £ symbol and parse
  const cleanValue = currencyString.replace(/£/g, '').trim();
  const numericValue = parseFloat(cleanValue);
  
  return isNaN(numericValue) ? null : numericValue;
}

/**
 * Validate currency format
 * @param value - Currency string to validate
 * @returns True if valid currency format
 */
export function isValidCurrency(value: string): boolean {
  // Check if it matches pattern like £85.00 or £85
  const currencyPattern = /^£?\d+(\.\d{2})?$/;
  return currencyPattern.test(value);
}
