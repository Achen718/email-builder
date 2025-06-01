require('dotenv').config();

const admin = require('firebase-admin');

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

    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      console.log('No users found to distribute templates to.');
      return;
    }

    console.log(`Found ${usersSnapshot.size} users for distribution`);
    let processedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      try {
        const userTemplatesSnapshot = await db
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

distributeTemplates()
  .then(() => {
    console.log('Distribution script completed');
  })
  .catch((error) => {
    console.error('Distribution script failed:', error);
    process.exit(1);
  });
