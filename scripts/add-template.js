// Create this as a new .js file (not .ts)
require('dotenv').config();
const {
  addDefaultTemplate,
} = require('../features/templates/services/default-templates');
// Use direct Firebase Admin initialization
const admin = require('firebase-admin');
const emailDesignMock = require('../mocks/designs/emailDesignMock.json');

// Initialize Firebase Admin directly from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

async function addTemplate() {
  try {
    console.log('Starting to add default template...');
    const template = {
      name: 'MacBook Pro Marketing Email',
      displayMode: 'Featured',
      design: emailDesignMock,
      category: 'Marketing',
      thumbnail:
        'https://assets.unlayer.com/projects/139/1676495949571-hero_2x.jpg',
    };
    const templateId = await addDefaultTemplate(template);
    console.log(`Added MacBook template with ID: ${templateId}`);
  } catch (error) {
    console.error('Error adding template:', error);
  }
}

addTemplate();
