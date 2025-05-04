import { adminDb } from '@/lib/firebase/admin-app';
import { EmailDesign } from '@/types/templates';
import { uploadImageToS3 } from '@/services/storage/image-storage';
import { getAssetUrl } from '@/lib/aws/s3-client';
import fetch from 'node-fetch';

interface DesignNode {
  type: string;
  values?: {
    src?: {
      url: string;
    };
    [key: string]: unknown;
  };
  contents?: DesignNode[];
  columns?: DesignNode[];
  [key: string]: unknown;
}

export interface DefaultTemplate {
  id?: string;
  name: string;
  design: EmailDesign;
  displayMode: 'Featured' | 'Standard';
  thumbnail?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Process template to use CloudFront URLs for all images
async function processTemplateImages(
  template: EmailDesign
): Promise<EmailDesign> {
  const processedTemplate = JSON.parse(JSON.stringify(template));
  const imageMapping = new Map<string, string>();

  // Helper function to process images recursively
  const processNode = async (node: DesignNode): Promise<void> => {
    // Check for image nodes
    if (node.type === 'image' && node.values?.src?.url) {
      const originalUrl = node.values.src.url;

      // Skip if we've already processed this image
      if (imageMapping.has(originalUrl)) {
        node.values.src.url = imageMapping.get(originalUrl)!;
        return;
      }

      try {
        // Extract filename from URL
        const urlParts = originalUrl.split('/');
        const filename = urlParts[urlParts.length - 1];

        // Fetch the image
        const response = await fetch(originalUrl);
        if (!response.ok)
          throw new Error(`Failed to fetch image: ${originalUrl}`);

        // Upload to S3 with a path indicating it's a template asset
        const imageBuffer = await response.buffer();
        const s3Key = `template-assets/${filename}`;

        await uploadImageToS3(
          imageBuffer,
          'system-templates', // Use a fixed userId for system templates
          {
            contentType: response.headers.get('content-type') || 'image/jpeg',
            fileName: filename,
          }
        );

        // Get CloudFront URL and update the template
        const cloudFrontUrl = getAssetUrl(s3Key);
        node.values.src.url = cloudFrontUrl;

        // Save mapping for reuse
        imageMapping.set(originalUrl, cloudFrontUrl);
      } catch (error) {
        console.error(`Failed to process image ${node.values.src.url}:`, error);
        // Keep the original URL if processing fails
      }
    }

    // Process any child elements
    if (node.contents) {
      for (const content of node.contents) {
        await processNode(content);
      }
    }

    // Process columns for rows
    if (node.columns) {
      for (const column of node.columns) {
        await processNode(column);
      }
    }
  };

  // Process rows in the template
  if (processedTemplate.body?.rows) {
    for (const row of processedTemplate.body.rows) {
      await processNode(row);
    }
  }

  return processedTemplate;
}

// Add a new template to the default_templates collection
export async function addDefaultTemplate(
  template: DefaultTemplate
): Promise<string> {
  try {
    // Process all images in the template to use CloudFront
    const processedDesign = await processTemplateImages(template.design);

    // Create document in default_templates collection
    const templateRef = adminDb.collection('default_templates').doc();
    await templateRef.set({
      ...template,
      design: processedDesign,
      id: templateRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(
      `Default template "${template.name}" added with ID: ${templateRef.id}`
    );
    return templateRef.id;
  } catch (error) {
    console.error('Error adding default template:', error);
    throw error;
  }
}

// Get all default templates
export async function getDefaultTemplates(): Promise<DefaultTemplate[]> {
  const snapshot = await adminDb.collection('default_templates').get();
  return snapshot.docs.map((doc) => ({ ...doc.data() } as DefaultTemplate));
}

// Get a specific default template
export async function getDefaultTemplateById(
  id: string
): Promise<DefaultTemplate | null> {
  const doc = await adminDb.collection('default_templates').doc(id).get();
  if (!doc.exists) return null;
  return { ...doc.data() } as DefaultTemplate;
}
