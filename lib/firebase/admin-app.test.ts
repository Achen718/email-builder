// Mock Firebase Admin SDK
jest.mock('firebase-admin/app', () => {
  const mockInitializeApp = jest.fn();
  const mockGetApps = jest.fn().mockReturnValue([]);
  const mockCert = jest.fn().mockReturnValue({});
  return {
    initializeApp: mockInitializeApp,
    getApps: mockGetApps,
    cert: mockCert,
  };
});

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({}),
}));

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({}),
}));

describe('Firebase Admin App', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    jest.resetModules();

    originalEnv = { ...process.env };
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL = 'test@example.com';
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = 'test-key\\nwith\\nnewlines';
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should initialize a new app when no apps exist', async () => {
    jest.doMock('firebase-admin/app', () => {
      const mockApp = { name: 'mock-app' };
      return {
        initializeApp: jest.fn().mockReturnValue(mockApp),
        getApps: jest.fn().mockReturnValue([]),
        cert: jest.fn().mockReturnValue({}),
      };
    });

    // Import the module under test and the mocks
    const { adminApp } = require('./admin-app');
    const { getApps, initializeApp, cert } = require('firebase-admin/app');
    expect(getApps).toHaveBeenCalled();
    expect(cert).toHaveBeenCalledWith({
      projectId: 'test-project-id',
      clientEmail: 'test@example.com',
      privateKey: 'test-key\nwith\nnewlines',
    });
    expect(initializeApp).toHaveBeenCalled();
    expect(adminApp).toEqual(expect.objectContaining({ name: 'mock-app' }));
  });

  it('should return existing app when apps already exist', async () => {
    jest.resetModules();

    jest.doMock('firebase-admin/app', () => {
      const mockExistingApp = { name: 'existing-app' };
      return {
        initializeApp: jest.fn(),
        getApps: jest.fn().mockReturnValue([mockExistingApp]),
        cert: jest.fn().mockReturnValue({}),
      };
    });

    // Import module under test
    const { adminApp } = require('./admin-app');

    // Get reference to the mocks for assertions
    const { getApps, initializeApp } = require('firebase-admin/app');

    expect(getApps).toHaveBeenCalled();
    expect(initializeApp).not.toHaveBeenCalled();
    expect(adminApp).toEqual(expect.objectContaining({ name: 'existing-app' }));
  });

  it('should properly initialize adminAuth with the admin app', async () => {
    const mockApp = { name: 'mock-app' };
    jest.doMock('firebase-admin/app', () => {
      return {
        initializeApp: jest.fn().mockReturnValue(mockApp),
        getApps: jest.fn().mockReturnValue([]),
        cert: jest.fn().mockReturnValue({}),
      };
    });

    const mockAuth = { name: 'mock-auth' };
    jest.doMock('firebase-admin/auth', () => {
      return {
        getAuth: jest.fn().mockReturnValue(mockAuth),
      };
    });

    // Import module under test
    const { adminAuth } = require('./admin-app');

    // Get the updated mock for assertions
    const { getAuth } = require('firebase-admin/auth');

    expect(getAuth).toHaveBeenCalled();
    expect(adminAuth).toEqual(expect.objectContaining({ name: 'mock-auth' }));
  });

  it('should properly initialize adminDb with the admin app', async () => {
    const mockApp = { name: 'mock-app' };
    jest.doMock('firebase-admin/app', () => {
      return {
        initializeApp: jest.fn().mockReturnValue(mockApp),
        getApps: jest.fn().mockReturnValue([]),
        cert: jest.fn().mockReturnValue({}),
      };
    });

    const mockFirestore = { name: 'mock-firestore' };
    jest.doMock('firebase-admin/firestore', () => {
      return {
        getFirestore: jest.fn().mockReturnValue(mockFirestore),
      };
    });

    const { adminDb } = require('./admin-app');

    const { getFirestore } = require('firebase-admin/firestore');

    expect(getFirestore).toHaveBeenCalled();
    expect(adminDb).toEqual(
      expect.objectContaining({ name: 'mock-firestore' })
    );
  });

  it('should handle undefined private key gracefully', async () => {
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    // Set up mocks for this test
    const mockApp = { name: 'mock-app' };
    jest.doMock('firebase-admin/app', () => {
      return {
        initializeApp: jest.fn().mockReturnValue(mockApp),
        getApps: jest.fn().mockReturnValue([]),
        cert: jest.fn(),
      };
    });

    // Import module under test
    const { adminApp } = require('./admin-app');

    // Get reference to the mocks for assertions
    const { cert } = require('firebase-admin/app');

    expect(cert).toHaveBeenCalledWith({
      projectId: 'test-project-id',
      clientEmail: 'test@example.com',
      privateKey: undefined,
    });
    expect(adminApp).toEqual(expect.objectContaining({ name: 'mock-app' }));
  });
});
