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

async function processTemplateImages(
  template: EmailDesign
): Promise<EmailDesign> {
  const processedTemplate = JSON.parse(JSON.stringify(template));
  const imageMapping = new Map<string, string>();
  const processNode = async (node: DesignNode): Promise<void> => {
    if (node.type === 'image' && node.values?.src?.url) {
      const originalUrl = node.values.src.url;

      // Skip if we've already processed this image
      if (imageMapping.has(originalUrl)) {
        node.values.src.url = imageMapping.get(originalUrl)!;
        return;
      }

      try {
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
        const cloudFrontUrl = getAssetUrl(s3Key);
        node.values.src.url = cloudFrontUrl;

        imageMapping.set(originalUrl, cloudFrontUrl);
      } catch (error) {
        console.error(`Failed to process image ${node.values.src.url}:`, error);
        // Keep the original URL if processing fails
      }
    } // Process any child elements
    if (node.contents) {
      for (const content of node.contents) {
        await processNode(content);
      }
    }

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

export async function addDefaultTemplate(
  template: DefaultTemplate
): Promise<string> {
  try {
    // Process all images in the template to use CloudFront
    const processedDesign = await processTemplateImages(template.design);

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

/**
 * Copies all default templates to a specific user's templates collection
 * Used when creating new user accounts to give them starter templates
 */
export async function addDefaultTemplatesForUser(
  userId: string
): Promise<void> {
  try {
    console.log(`Adding default templates for user ${userId}...`);

    const defaultTemplates = await getDefaultTemplates();

    if (defaultTemplates.length === 0) {
      console.log('No default templates found to add for new user');
      return;
    }

    const batch = adminDb.batch();
    let count = 0;

    for (const template of defaultTemplates) {
      const userTemplateRef = adminDb
        .collection('users')
        .doc(userId)
        .collection('templates')
        .doc();

      batch.set(userTemplateRef, {
        id: userTemplateRef.id,
        name: template.name,
        design: template.design, // Already processed when added as default template
        displayMode: template.displayMode,
        category: template.category || null,
        thumbnail: template.thumbnail || null,
        isDefault: true,
        sourceTemplateId: template.id,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      count++;
    }

    // Commit the batch
    await batch.commit();
    console.log(
      `Successfully added ${count} default templates for user ${userId}`
    );
  } catch (error) {
    console.error(`Error adding default templates for user ${userId}:`, error);
    throw error;
  }
}

// Get all default templates
export async function getDefaultTemplates(): Promise<DefaultTemplate[]> {
  const snapshot = await adminDb.collection('default_templates').get();
  return snapshot.docs.map((doc) => ({ ...doc.data() } as DefaultTemplate));
}

export async function getDefaultTemplateById(
  id: string
): Promise<DefaultTemplate | null> {
  const doc = await adminDb.collection('default_templates').doc(id).get();
  if (!doc.exists) return null;
  return { ...doc.data() } as DefaultTemplate;
}
