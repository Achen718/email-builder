export { useAuth } from './hooks/useAuth';
export { useAuthStateSync } from './hooks/useAuthStateSync';

// Export types and interfaces from auth-slice
export type { IAuthState } from './auth-slice';

// Export Redux actions
export {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  authReducer,
} from './auth-slice';

// Export API hooks
export {
  useCreateUserDocumentMutation,
  useCreateSessionMutation,
  useLoginWithEmailMutation,
  useSignUpWithEmailMutation,
  useGoogleLoginMutation,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} from './auth-api';
