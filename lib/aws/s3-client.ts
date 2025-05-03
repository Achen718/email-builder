import { S3Client } from '@aws-sdk/client-s3';
import { AWS_REGION, getAwsCredentials } from './client';

// Load environment variables or terraform outputs for S3 config
const S3_BUCKET_NAME =
  process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'email-builder-email-assets';
const S3_BUCKET_DOMAIN =
  process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN ||
  `${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;

// CloudFront domain for serving assets
const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || '';

// Create S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: getAwsCredentials(),
});

// Function to generate URLs - prefer CloudFront if available
export function getAssetUrl(key: string): string {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }

  // Fallback to direct S3 URL
  return `https://${S3_BUCKET_DOMAIN}/${key}`;
}

export { s3Client, S3_BUCKET_NAME, S3_BUCKET_DOMAIN, CLOUDFRONT_DOMAIN };
