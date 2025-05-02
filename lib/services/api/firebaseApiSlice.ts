import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { googleSignIn } from '@/services/auth/firebaseAuthService';
import type { RootState } from '@/lib/store/store';

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    // fix jest warning: ReferenceError: fetch is not defined
    fetchFn: typeof window !== 'undefined' ? undefined : global.fetch,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as RootState).auth?.userToken;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    // Keep your existing endpoint
    createUserDocument: build.mutation({
      query: ({ idToken, additionalUserData }) => ({
        url: '/api/users/create',
        method: 'POST',
        body: { idToken, additionalUserData },
      }),
      invalidatesTags: ['User'],
    }),
    // client first approach
    googleLogin: build.mutation({
      queryFn: async () => {
        try {
          const result = await googleSignIn();
          return { data: result };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error,
              error: String(error),
            },
          };
        }
      },
    }),
    // Replace mockAuth endpoints with real ones - APi first approach
    loginWithEmail: build.mutation({
      query: ({ email, password }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      invalidatesTags: ['User'],
    }),

    signUpWithEmail: build.mutation({
      query: ({ firstName, email, password }) => ({
        url: '/api/auth/sign-up',
        method: 'POST',
        body: { firstName, email, password },
      }),
      invalidatesTags: ['User'],
    }),

    // Replace userAuth with session check
    getCurrentUser: build.query({
      query: () => '/api/auth/session',
      providesTags: ['User'],
    }),

    logoutUser: build.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useCreateUserDocumentMutation,
  useLoginWithEmailMutation,
  useSignUpWithEmailMutation,
  useGoogleLoginMutation,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} = firebaseApi;
