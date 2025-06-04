import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian Rupees (INR)
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted currency string (e.g., "₹1,234.56")
 */
export function formatCurrency(amount: number | undefined, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}) {
  // Handle undefined/NaN values
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(numericAmount);
}
