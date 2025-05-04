import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { googleSignIn } from '@/services/auth/client-auth';
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
    createSession: build.mutation({
      query: ({ idToken }) => ({
        url: '/api/auth/session',
        method: 'POST',
        body: { idToken },
      }),
    }),
    // client first approach
    googleLogin: build.mutation({
      async queryFn(_, { dispatch }) {
        try {
          // 1. Get user from Firebase
          const authResult = await googleSignIn();

          // 2. Create user document using existing mutation
          const result = await dispatch(
            firebaseApi.endpoints.createUserDocument.initiate({
              idToken: authResult.userToken,
            })
          ).unwrap();

          // 3. Return complete result
          return { data: authResult };
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
      query: ({ displayName, email, password }) => ({
        url: '/api/auth/sign-up',
        method: 'POST',
        body: { displayName, email, password },
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
  useCreateSessionMutation,
  useLoginWithEmailMutation,
  useSignUpWithEmailMutation,
  useGoogleLoginMutation,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} = firebaseApi;
