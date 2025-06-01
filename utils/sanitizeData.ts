export function sanitizeDataForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeDataForFirestore(item)) as unknown as T;
  }

  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null) {
        result[key as keyof T] = sanitizeDataForFirestore(value);
      } else {
        result[key as keyof T] = value;
      }
    }
  }

  return result;
}
