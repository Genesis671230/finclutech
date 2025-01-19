/**
 * Utility functions for formatting currency and dates
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string or timestamp
 * @param {string|number|Date} date - The date to format
 * @param {string} format - The format to use (default: 'full')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full', locale = 'en-US') => {
  if (!date) return '';

  const dateObj = new Date(date);
  
  const options = {
    full: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    short: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit' 
    }
  };

  return dateObj.toLocaleDateString(locale, options[format] || options.full);
}; 