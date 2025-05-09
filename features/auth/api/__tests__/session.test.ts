import { verifyUserSession, createUserSession } from '../session';
import { adminAuth, adminDb } from '@/lib/firebase/admin-app';
import { verifyIdToken } from '@/services/auth/admin-auth';

// Mock dependencies
jest.mock('@/lib/firebase/admin-app', () => {
  // Create mock document reference with get method
  const mockDocRef = {
    get: jest.fn(),
  };

  // Create mock collection reference that returns the doc reference
  const mockCollectionRef = {
    doc: jest.fn().mockReturnValue(mockDocRef),
  };

  return {
    adminAuth: {
      verifySessionCookie: jest.fn(),
      createSessionCookie: jest.fn(),
    },
    adminDb: {
      collection: jest.fn().mockReturnValue(mockCollectionRef),
    },
  };
});

jest.mock('@/services/auth/admin-auth', () => ({
  verifyIdToken: jest.fn(),
}));

describe('verifyUserSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns unauthenticated when session cookie is undefined', async () => {
    const result = await verifyUserSession(undefined);
    expect(result).toEqual({ authenticated: false });
    expect(adminAuth.verifySessionCookie).not.toHaveBeenCalled();
  });

  test('returns user data when session is valid and user exists in Firestore', async () => {
    // Setup mocks
    (adminAuth.verifySessionCookie as jest.Mock).mockResolvedValueOnce({
      uid: 'test-uid',
      email: 'test@example.com',
    });

    const mockUserData = { name: 'Test User', email: 'test@example.com' };
    const mockDocSnap = {
      exists: true,
      data: () => mockUserData,
    };

    // Get reference to the document's get method
    const docRef = adminDb.collection('users').doc('test-uid');
    (docRef.get as jest.Mock).mockResolvedValueOnce(mockDocSnap);

    const result = await verifyUserSession('valid-session-cookie');

    expect(adminAuth.verifySessionCookie).toHaveBeenCalledWith(
      'valid-session-cookie',
      true
    );
    expect(adminDb.collection).toHaveBeenCalledWith('users');
    expect(docRef.get).toHaveBeenCalled();
    expect(result).toEqual({
      authenticated: true,
      user: {
        uid: 'test-uid',
        ...mockUserData,
      },
    });
  });

  test('returns basic user data when session is valid but user does not exist in Firestore', async () => {
    // Setup mocks
    (adminAuth.verifySessionCookie as jest.Mock).mockResolvedValueOnce({
      uid: 'test-uid',
      email: 'test@example.com',
    });

    // Mock document that doesn't exist
    const mockDocSnap = {
      exists: false,
    };

    // Get reference to the document's get method
    const docRef = adminDb.collection('users').doc('test-uid');
    (docRef.get as jest.Mock).mockResolvedValueOnce(mockDocSnap);

    const result = await verifyUserSession('valid-session-cookie');

    expect(adminAuth.verifySessionCookie).toHaveBeenCalledWith(
      'valid-session-cookie',
      true
    );
    expect(adminDb.collection).toHaveBeenCalledWith('users');
    expect(docRef.get).toHaveBeenCalled();
    expect(result).toEqual({
      authenticated: true,
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
      },
    });
  });

  test('returns unauthenticated with shouldClearCookie when session verification fails', async () => {
    (adminAuth.verifySessionCookie as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid session')
    );

    const result = await verifyUserSession('invalid-session-cookie');

    expect(result).toEqual({
      authenticated: false,
      shouldClearCookie: true,
    });
  });
});

describe('createUserSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates session cookie successfully', async () => {
    // Setup mocks
    (verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: 'test-uid',
      email: 'test@example.com',
    });

    (adminAuth.createSessionCookie as jest.Mock).mockResolvedValueOnce(
      'new-session-cookie'
    );

    const result = await createUserSession('valid-id-token');

    expect(verifyIdToken).toHaveBeenCalledWith('valid-id-token');
    expect(adminAuth.createSessionCookie).toHaveBeenCalledWith(
      'valid-id-token',
      { expiresIn: 60 * 60 * 24 * 5 * 1000 }
    );

    expect(result).toEqual({
      success: true,
      sessionCookie: 'new-session-cookie',
      expiresIn: 60 * 60 * 24 * 5 * 1000,
      uid: 'test-uid',
    });
  });

  test('returns error when ID token verification fails', async () => {
    (verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid ID token')
    );

    const result = await createUserSession('invalid-id-token');

    expect(result).toEqual({
      success: false,
      error: 'Invalid ID token',
    });
    expect(adminAuth.createSessionCookie).not.toHaveBeenCalled();
  });

  test('returns error when session cookie creation fails', async () => {
    (verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: 'test-uid',
    });

    (adminAuth.createSessionCookie as jest.Mock).mockRejectedValueOnce(
      new Error('Session cookie creation failed')
    );

    const result = await createUserSession('valid-id-token');

    expect(result).toEqual({
      success: false,
      error: 'Session cookie creation failed',
    });
  });
});
