import { adminDb } from '@/lib/firebase/admin-app';
import * as dotenv from 'dotenv';
import { FieldPath, Query, DocumentData } from 'firebase-admin/firestore';
import { DefaultTemplate } from './default-templates';

dotenv.config();

/**
 * Distributes templates to all users
 *
 * For a production app, this would be better implemented as a Cloud Function
 * that triggers when new templates are created. However, for demonstration
 * purposes, this script shows batch processing techniques directly.
 *
 * @param templateId Optional - specific template to distribute. If omitted, distributes all templates.
 */
export async function distributeTemplates(templateId?: string) {
  try {
    console.log(
      templateId
        ? `Starting distribution of template ${templateId} to all users...`
        : 'Starting distribution of all templates to users...'
    );

    // Get default templates - either all or just the specific one
    let defaultTemplatesQuery: Query<DocumentData> =
      adminDb.collection('default_templates');
    if (templateId) {
      defaultTemplatesQuery = defaultTemplatesQuery.where(
        'id',
        '==',
        templateId
      );
    }

    const defaultTemplatesSnapshot = await defaultTemplatesQuery.get();
    const defaultTemplates: DefaultTemplate[] =
      defaultTemplatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || 'Untitled',
        design: doc.data().design || {},
        displayMode: doc.data().displayMode || 'Standard',
      }));

    if (defaultTemplates.length === 0) {
      console.log('No templates found to distribute');
      return;
    }

    console.log(`Found ${defaultTemplates.length} template(s) to distribute`);
    let lastUid = null;
    let processedCount = 0;
    const batchSize = 100;

    while (true) {
      let usersQuery = adminDb.collection('users').limit(batchSize);
      if (lastUid) {
        // Fix: Use document ID for ordering, not a field called 'uid'
        usersQuery = usersQuery
          .orderBy(FieldPath.documentId())
          .startAfter(lastUid);
      }

      const usersSnapshot = await usersQuery.get();

      // Exit loop if no more users
      if (usersSnapshot.empty) {
        break;
      }

      console.log(`Processing batch of ${usersSnapshot.size} users`);
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        lastUid = userId;

        try {
          const userTemplatesSnapshot = await adminDb
            .collection('users')
            .doc(userId)
            .collection('templates')
            .where('isDefault', '==', true)
            .get();

          const existingTemplateIds = new Set();
          userTemplatesSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.sourceTemplateId) {
              existingTemplateIds.add(data.sourceTemplateId);
            }
          });

          const batch = adminDb.batch();
          let addedCount = 0;

          for (const template of defaultTemplates) {
            // Skip if user already has this template
            if (existingTemplateIds.has(template.id)) continue;

            const userTemplateRef = adminDb
              .collection('users')
              .doc(userId)
              .collection('templates')
              .doc();

            batch.set(userTemplateRef, {
              name: template.name || 'Untitled Template',
              design: template.design || {}, // Consider a more specific default structure if possible
              displayMode: template.displayMode || 'Standard',
              isDefault: true,
              userId,
              sourceTemplateId: template.id,
              id: userTemplateRef.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            addedCount++;
          }

          if (addedCount > 0) {
            await batch.commit();
            console.log(`Added ${addedCount} templates to user ${userId}`);
          }
        } catch (error) {
          console.error(`Error processing user ${userId}:`, error);
        }

        processedCount++;
      }

      console.log(`Processed ${processedCount} users so far`);
    }

    console.log(`Completed processing ${processedCount} users`);
  } catch (error) {
    console.error('Error in distribution script:', error);
  }
}

// Maintain backward compatibility
export const distributeNewTemplate = distributeTemplates;

// Only run the script if this file is executed directly
if (require.main === module) {
  const targetTemplateId = process.argv[2];

  distributeTemplates(targetTemplateId)
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export async function distributeTemplatesForUser(
  userId: string
): Promise<void> {
  try {
    console.log(`Starting template distribution for user ${userId}`);

    const defaultTemplates = await getDefaultTemplatesArray();

    if (defaultTemplates.length === 0) {
      console.log('No templates found to distribute');
      return;
    }

    const existingTemplateIds = await getUserExistingTemplateIds(userId);

    // Filter templates that need to be added (pure function)
    const templatesToAdd = defaultTemplates.filter(
      (template) =>
        template.id !== undefined && !existingTemplateIds.has(template.id)
    );

    if (templatesToAdd.length === 0) {
      console.log(`User ${userId} already has all templates`);
      return;
    }

    const batch = adminDb.batch();

    // Transform templates into batch operations
    templatesToAdd.forEach((template) => {
      const userTemplateRef = adminDb
        .collection('users')
        .doc(userId)
        .collection('templates')
        .doc();

      batch.set(
        userTemplateRef,
        createTemplateDocument(template, userId, userTemplateRef.id)
      );
    });

    await batch.commit();
    console.log(`Added ${templatesToAdd.length} templates to user ${userId}`);
  } catch (error) {
    console.error(`Error distributing templates to user ${userId}:`, error);
    throw error;
  }
}

// Pure function to create template document
function createTemplateDocument(
  template: DefaultTemplate,
  userId: string,
  docId: string
) {
  return {
    name: template.name || 'Untitled Template',
    design: template.design || {},
    displayMode: template.displayMode || 'Standard',
    isDefault: true,
    userId,
    sourceTemplateId: template.id,
    id: docId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Pure function to get default templates
async function getDefaultTemplatesArray(): Promise<DefaultTemplate[]> {
  const defaultTemplatesSnapshot = await adminDb
    .collection('default_templates')
    .get();

  return defaultTemplatesSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || 'Untitled',
    design: doc.data().design || {},
    displayMode: doc.data().displayMode || 'Standard',
  }));
}

// Function to extract user template IDs
async function getUserExistingTemplateIds(
  userId: string
): Promise<Set<string>> {
  const userTemplatesSnapshot = await adminDb
    .collection('users')
    .doc(userId)
    .collection('templates')
    .where('isDefault', '==', true)
    .get();

  return new Set(
    userTemplatesSnapshot.docs
      .map((doc) => doc.data().sourceTemplateId)
      .filter(Boolean)
  );
}
