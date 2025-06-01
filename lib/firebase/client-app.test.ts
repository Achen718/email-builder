import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

// Define interfaces for your mock objects
interface MockFirebaseApp extends FirebaseApp {
  name: string;
}

interface MockAuth extends Auth {
  name: string;
}

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({} as MockFirebaseApp)),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({} as MockAuth)),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: 'local',
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({} as Firestore)),
}));

describe('Firebase Client App', () => {
  const originalEnv = process.env;
  let mockApp: MockFirebaseApp;
  let mockAuth: MockAuth;

  beforeEach(() => {
    jest.resetModules();

    // typed mock objects
    mockApp = { name: 'test-app' } as MockFirebaseApp;
    mockAuth = { name: 'mock-auth' } as MockAuth;

    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');

    (initializeApp as jest.Mock).mockReturnValue(mockApp);
    (getAuth as jest.Mock).mockReturnValue(mockAuth);

    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'test-project-id',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'test-sender-id',
      NEXT_PUBLIC_FIREBASE_APP_ID: 'test-app-id',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('initializes Firebase with correct config', () => {
    require('./client-app');
    const { initializeApp } = require('firebase/app');

    expect(initializeApp as jest.Mock).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-sender-id',
      appId: 'test-app-id',
    });
  });

  test('sets up authentication with persistence', () => {
    require('./client-app');
    const {
      getAuth,
      setPersistence,
      browserLocalPersistence,
    } = require('firebase/auth');

    expect(getAuth as jest.Mock).toHaveBeenCalledWith(mockApp);
    expect(setPersistence as jest.Mock).toHaveBeenCalledWith(
      mockAuth,
      browserLocalPersistence
    );
  });

  test('initializes Firestore with app instance', () => {
    require('./client-app');
    const { getFirestore } = require('firebase/firestore');

    expect(getFirestore as jest.Mock).toHaveBeenCalledWith(mockApp);
  });
});
