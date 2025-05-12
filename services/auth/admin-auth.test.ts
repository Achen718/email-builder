import { verifyIdToken } from './admin-auth';
import { adminAuth } from '@/lib/firebase/admin-app';

// Mock the Firebase admin module
jest.mock('@/lib/firebase/admin-app', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

describe('verifyIdToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return decoded token when verification succeeds', async () => {
    const mockToken = 'valid-id-token';
    const mockDecodedToken = { uid: 'user123', email: 'test@example.com' };

    // Setup mock to return successful response
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValueOnce(
      mockDecodedToken
    );

    const result = await verifyIdToken(mockToken);

    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(result).toEqual(mockDecodedToken);
  });

  it('should throw Unauthorized error when verification fails', async () => {
    const mockToken = 'invalid-id-token';
    const mockError = new Error('Firebase auth error');

    // Setup mock to throw an error
    (adminAuth.verifyIdToken as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(verifyIdToken(mockToken)).rejects.toThrow('Unauthorized');
    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(console.error).toHaveBeenCalledWith(
      'Error verifying token:',
      mockError
    );
  });
});
