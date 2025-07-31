/**
 * Formats a number as currency with consistent formatting
 * Always shows 2 decimal places and uses US dollar format
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Formats a number as currency with unit
 * Example: $12.34/ea
 */
export const formatCurrencyWithUnit = (amount: number, unit: string): string => {
  return `${formatCurrency(amount)}/${unit}`;
};