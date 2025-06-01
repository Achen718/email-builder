import { firebaseApi } from '@/features/auth/auth-api';

interface TemplateCheckResponse {
  needsTemplateSync: boolean;
}

export const templatesApi = firebaseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkTemplates: builder.query<TemplateCheckResponse, void>({
      query: () => '/api/user/check-templates',
    }),
    syncDefaultTemplates: builder.mutation<void, void>({
      query: () => ({
        url: '/api/templates/default',
        method: 'POST',
      }),
      // Invalidate any cached template data after syncing
      invalidatesTags: ['Templates'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCheckTemplatesQuery,
  useLazyCheckTemplatesQuery,
  useSyncDefaultTemplatesMutation,
} = templatesApi;
