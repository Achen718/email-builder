import { createUserDocument } from '../create-user';
import { adminAuth, adminDb } from '@/lib/firebase/admin-app';
import { addDefaultTemplatesForUser } from '@/features/templates/services/default-templates';
import { verifyIdToken } from '@/services/auth/admin-auth';

jest.mock('@/lib/firebase/admin-app', () => {
  const mockDocRef = {
    get: jest.fn(),
    set: jest.fn(),
    id: 'test-uid',
  };

  const mockCollectionRef = {
    doc: jest.fn().mockReturnValue(mockDocRef),
  };

  return {
    adminAuth: {
      getUser: jest.fn(),
    },
    adminDb: {
      collection: jest.fn().mockReturnValue(mockCollectionRef),
    },
    __mockDocRef: mockDocRef,
  };
});

const { __mockDocRef: mockDocRef } = require('@/lib/firebase/admin-app');

jest.mock('@/services/auth/admin-auth', () => ({
  verifyIdToken: jest.fn(),
}));

jest.mock('@/features/templates/services/default-templates', () => ({
  addDefaultTemplatesForUser: jest.fn(),
}));

describe('createUserDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockDocRef.get.mockReset();
    mockDocRef.set.mockReset();

    // Common setup
    (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'test-uid' });
    (adminAuth.getUser as jest.Mock).mockResolvedValue({
      uid: 'test-uid',
      displayName: 'Test User',
      email: 'test@example.com',
    });
  });

  test('should create a new user document when user does not exist', async () => {
    mockDocRef.get.mockResolvedValue({ exists: false });
    mockDocRef.set.mockResolvedValue(undefined);

    const result = await createUserDocument('valid-id-token');

    expect(verifyIdToken).toHaveBeenCalledWith('valid-id-token');
    expect(adminAuth.getUser).toHaveBeenCalledWith('test-uid');
    expect(adminDb.collection).toHaveBeenCalledWith('users');
    expect(adminDb.collection('users').doc).toHaveBeenCalledWith('test-uid');
    expect(mockDocRef.set).toHaveBeenCalledWith({
      displayName: 'Test User',
      email: 'test@example.com',
      createdAt: expect.any(Date),
      hasDefaultTemplates: true,
    });
    expect(addDefaultTemplatesForUser).toHaveBeenCalledWith('test-uid');

    expect(result).toEqual({
      success: true,
      userId: 'test-uid',
      documentId: 'test-uid',
      isNewUser: true,
    });
  });
  test('should merge additional user data when creating new user document', async () => {
    mockDocRef.get.mockResolvedValue({ exists: false });

    mockDocRef.set.mockResolvedValue(undefined);

    const additionalData = { role: 'admin', plan: 'premium' };
    await createUserDocument('valid-id-token', additionalData);

    expect(mockDocRef.set).toHaveBeenCalledWith({
      displayName: 'Test User',
      email: 'test@example.com',
      createdAt: expect.any(Date),
      hasDefaultTemplates: true,
      role: 'admin',
      plan: 'premium',
    });
  });
  test('should not create document when user already exists', async () => {
    const docRef = adminDb.collection('users').doc('test-uid');

    mockDocRef.get.mockResolvedValue({
      exists: true,
      id: 'test-uid',
    });

    const result = await createUserDocument('valid-id-token');

    expect(verifyIdToken).toHaveBeenCalledWith('valid-id-token');
    expect(adminAuth.getUser).toHaveBeenCalledWith('test-uid');
    expect(docRef.set).not.toHaveBeenCalled();
    expect(addDefaultTemplatesForUser).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: true,
      userId: 'test-uid',
      documentId: 'test-uid',
      isNewUser: false,
    });
  });

  test('should throw error when token verification fails', async () => {
    (verifyIdToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    await expect(createUserDocument('invalid-id-token')).rejects.toThrow(
      'Invalid token'
    );
    expect(adminAuth.getUser).not.toHaveBeenCalled();
  });

  test('should throw error when user retrieval fails', async () => {
    (adminAuth.getUser as jest.Mock).mockRejectedValue(
      new Error('User not found')
    );

    await expect(createUserDocument('valid-id-token')).rejects.toThrow(
      'User not found'
    );
  });

  test('should throw error when document creation fails', async () => {
    // Mock document doesn't exist
    mockDocRef.get.mockResolvedValue({
      exists: false,
    });

    mockDocRef.set.mockRejectedValue(new Error('Database error'));

    await expect(createUserDocument('valid-id-token')).rejects.toThrow(
      'Database error'
    );
    expect(addDefaultTemplatesForUser).not.toHaveBeenCalled();
  });
  test('should throw error when adding default templates fails', async () => {
    mockDocRef.get.mockResolvedValue({
      exists: false,
    });

    mockDocRef.set.mockResolvedValue(undefined);

    (addDefaultTemplatesForUser as jest.Mock).mockRejectedValue(
      new Error('Template creation failed')
    );

    await expect(createUserDocument('valid-id-token')).rejects.toThrow(
      'Template creation failed'
    );
  });
});
