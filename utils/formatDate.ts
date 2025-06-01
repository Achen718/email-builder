import { Timestamp } from 'firebase/firestore';

export function formatPostedDate(
  dateInput: string | Date | Timestamp | number | undefined | null
): string {
  if (!dateInput) return 'No date';

  try {
    if (
      typeof dateInput === 'object' &&
      'toDate' in dateInput &&
      typeof dateInput.toDate === 'function'
    ) {
      return dateInput.toDate().toLocaleDateString();
    }

    const date =
      typeof dateInput === 'object' && dateInput instanceof Date
        ? dateInput
        : new Date(dateInput as string | number);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

export function formatDate(
  dateInput: string | Date | Timestamp | number | undefined | null
): string {
  if (!dateInput) return 'No date';
  try {
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
