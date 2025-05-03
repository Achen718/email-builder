import { Timestamp } from 'firebase/firestore';

export function formatPostedDate(
  dateInput: string | Date | Timestamp | number | undefined | null
): string {
  if (!dateInput) return 'No date';

  try {
    // Handle Firebase Timestamp
    if (
      typeof dateInput === 'object' &&
      'toDate' in dateInput &&
      typeof dateInput.toDate === 'function'
    ) {
      return dateInput.toDate().toLocaleDateString();
    }

    // Handle standard Date or string
    const date =
      typeof dateInput === 'object' && dateInput instanceof Date
        ? dateInput
        : new Date(dateInput as string | number);

    if (isNaN(date.getTime())) return 'Invalid date';

    // Format the date
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

// Same update for the formatDate function
export function formatDate(
  dateInput: string | Date | Timestamp | number | undefined | null
): string {
  if (!dateInput) return 'No date';

  try {
    // Handle Firebase Timestamp
    if (
      typeof dateInput === 'object' &&
      'toDate' in dateInput &&
      typeof dateInput.toDate === 'function'
    ) {
      return dateInput.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    // Handle standard Date or string
    const date =
      typeof dateInput === 'object' && dateInput instanceof Date
        ? dateInput
        : new Date(dateInput as string | number);

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}
