import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  s3Client,
  S3_BUCKET_NAME,
  S3_BUCKET_DOMAIN,
  CLOUDFRONT_DOMAIN,
  getAssetUrl,
} from '@/lib/aws/s3-client';

export interface UploadedImage {
  url: string;
  key: string;
  width?: number;
  height?: number;
}

/**
 * Upload image to S3 and return URL for use in templates
 */
export async function uploadImageToS3(
  file: File | Buffer,
  userId: string,
  metadata: {
    width?: number;
    height?: number;
    contentType?: string;
    fileName?: string;
  } = {}
): Promise<UploadedImage> {
  // Existing file handling code
  const fileName =
    metadata.fileName || (file instanceof File ? file.name : 'image.png');
  const fileExt = fileName.split('.').pop() || 'jpg';
  const uniqueFileName = `${uuidv4()}.${fileExt}`;
  const key = `users/${userId}/images/${uniqueFileName}`;

  // Upload to S3 (unchanged)
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body:
      file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file,
    ContentType:
      metadata.contentType || (file instanceof File ? file.type : 'image/jpeg'),
    ACL: 'public-read',
  });

  await s3Client.send(command);

  // Use the getAssetUrl function to get CloudFront URL when available
  return {
    url: getAssetUrl(key),
    key,
    width: metadata.width,
    height: metadata.height,
  };
}

/**
 * Delete image from S3
 */
export async function deleteImageFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}
