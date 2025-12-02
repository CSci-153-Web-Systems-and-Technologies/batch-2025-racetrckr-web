/**
 * Calculate the time remaining until a target date
 * @param targetDate - The target date to count down to
 * @returns Object containing days, hours, minutes, and seconds remaining
 */
export function calculateTimeRemaining(targetDate: Date) {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

/**
 * Format a number to always display with leading zeros (e.g., 05, 12)
 * @param num - The number to format
 * @param digits - Number of digits (default: 2)
 * @returns Formatted string with leading zeros
 */
export function padNumber(num: number, digits: number = 2): string {
  return String(num).padStart(digits, '0');
}

/**
 * Format time remaining into a human-readable string
 * @param days - Number of days
 * @param hours - Number of hours
 * @param minutes - Number of minutes
 * @returns Formatted string (e.g., "5 days, 3 hours, 20 minutes")
 */
export function formatTimeRemaining(days: number, hours: number, minutes: number): string {
  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  
  return parts.join(', ');
}
