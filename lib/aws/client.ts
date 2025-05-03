// Common AWS configuration and shared utilities
export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';

// Standard AWS credentials that can be used across services
export const getAwsCredentials = () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
});

// Helper for consistent error handling across AWS services
export function handleAwsError(error: unknown, serviceName: string): Error {
  console.error(`AWS ${serviceName} error:`, error);
  return new Error(
    `AWS ${serviceName} operation failed: ${
      (error as Error)?.message || 'Unknown error'
    }`
  );
}
