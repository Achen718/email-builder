import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { googleSignIn } from '@/services/auth/client-auth';
import type { RootState } from '@/lib/store/store';
import { setCredentials } from '@/features/auth/auth-slice';
import { UserData } from '@/features/auth/hooks/useAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client-app';

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
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
  tagTypes: ['User', 'Templates'],
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
          const authResult = await googleSignIn();

          const result = await dispatch(
            firebaseApi.endpoints.createUserDocument.initiate({
              idToken: authResult.userToken,
            })
          ).unwrap();

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

    loginWithEmail: build.mutation({
      async queryFn(
        { email, password },
        { dispatch },
        _extraOptions,
        baseQuery
      ) {
        try {
          // Authenticate with endpoint first
          const loginResult = await baseQuery({
            url: '/api/auth/login',
            method: 'POST',
            body: { email, password },
          });

          if (loginResult.error) return { error: loginResult.error };

          const { user, userToken } = loginResult.data as {
            user: UserData;
            userToken: string;
          };

          // IMPORTANT: Also sign in with Firebase client SDK
          try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase client auth successful');
          } catch (firebaseError) {
            console.error('Firebase client auth error:', firebaseError);
          }

          // Update Redux store fallback -- onAuthStateChanged will also do this
          dispatch(
            setCredentials({
              user,
              token: userToken,
            })
          );

          return { data: loginResult.data };
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
      invalidatesTags: ['User'],
    }),

    signUpWithEmail: build.mutation({
      async queryFn(
        { email, password, displayName },
        { dispatch },
        _extraOptions,
        baseQuery
      ) {
        try {
          const signupResult = await baseQuery({
            url: '/api/auth/sign-up',
            method: 'POST',
            body: { email, password, displayName },
          });

          if (signupResult.error) return { error: signupResult.error };

          const authResult = signupResult.data as { userToken: string };

          // Create the user document using existing endpoint
          await dispatch(
            firebaseApi.endpoints.createUserDocument.initiate({
              idToken: authResult.userToken,
              additionalUserData: { displayName },
            })
          ).unwrap();

          // Return the original auth result
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
      invalidatesTags: ['User'],
    }),

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
