// Load environment variables
require('dotenv').config();

// Use direct Firebase Admin initialization
const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function distributeTemplates() {
  try {
    console.log('Starting distribution of templates to all users...');

    // Get default templates
    const defaultTemplatesSnapshot = await db
      .collection('default_templates')
      .get();
    const defaultTemplates = defaultTemplatesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || 'Untitled',
      design: doc.data().design || {},
      displayMode: doc.data().displayMode || 'Standard',
      category: doc.data().category,
      thumbnail: doc.data().thumbnail,
    }));

    if (defaultTemplates.length === 0) {
      console.log('No templates found to distribute');
      return;
    }

    console.log(`Found ${defaultTemplates.length} template(s) to distribute`);

    // Get all users
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      console.log('No users found to distribute templates to.');
      return;
    }

    console.log(`Found ${usersSnapshot.size} users for distribution`);
    let processedCount = 0;

    // Process each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      try {
        // Get user's existing templates
        const userTemplatesSnapshot = await db
          .collection('users')
          .doc(userId)
          .collection('templates')
          .where('isDefault', '==', true)
          .get();

        // Create a set of template IDs the user already has
        const existingTemplateIds = new Set();
        userTemplatesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.sourceTemplateId) {
            existingTemplateIds.add(data.sourceTemplateId);
          }
        });

        // Add any missing templates
        const batch = db.batch();
        let addedCount = 0;

        for (const template of defaultTemplates) {
          // Skip if user already has this template
          if (existingTemplateIds.has(template.id)) continue;

          const userTemplateRef = db
            .collection('users')
            .doc(userId)
            .collection('templates')
            .doc();

          batch.set(userTemplateRef, {
            name: template.name || 'Untitled Template',
            design: template.design || {},
            displayMode: template.displayMode || 'Standard',
            isDefault: true,
            userId,
            sourceTemplateId: template.id,
            id: userTemplateRef.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category: template.category || null,
            thumbnail: template.thumbnail || null,
          });

          addedCount++;
        }

        if (addedCount > 0) {
          await batch.commit();
          console.log(`Added ${addedCount} templates to user ${userId}`);
        } else {
          console.log(`User ${userId} already has all templates`);
        }
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
      }

      processedCount++;
    }

    console.log(`Completed processing ${processedCount} users`);
  } catch (error) {
    console.error('Error in distribution script:', error);
  }
}

// Run the distribution
distributeTemplates()
  .then(() => {
    console.log('Distribution script completed');
  })
  .catch((error) => {
    console.error('Distribution script failed:', error);
    process.exit(1);
  });
