import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  User,
  Company,
  FeedbackData,
  Department,
  MetricsData,
  DepartmentStressLevels,
  CreateCompanyRequest,
  CreateCompanyResponse,
  SimplifiedCompany,
  SurveyTypes,
  CompanyUpdatePayload,
  MentalHealthContributorsResponse,
  WellbeingIndexResponse,
  ENPSResponse,
  LifeSatisfactionResponse,
} from '@/types';
import { RootState } from '@/stores/store';

export const ENV: string | undefined = import.meta.env.VITE_APP_ENV;
export const HOST: string | undefined = import.meta.env.VITE_APP_API;

if (!ENV) throw new Error('ENV value is missing');

export const isLocalhostMode = ENV === 'localhost' || ENV === 'local';

// If a HOST is provided and we're not in localhost mode, use it; otherwise, use the default localhost port.
export const RESOLVED_HOST =
  HOST && !isLocalhostMode ? HOST : 'https://hird-app-prod.azurewebsites.net'; // "localhost:3000";

// In both cases (localhost or not), use "https". If you need different protocols, you can further adjust this.
export const REST_PROTOCOL = ENV === 'localhost' ? 'http' : 'https';
export const WEBSOCKET_PROTOCOL = isLocalhostMode ? 'ws' : 'wss';

export const API_BASE_V1 = '/api/v1';

export const REST_API_BASE = `${REST_PROTOCOL}://${RESOLVED_HOST}${
  !isLocalhostMode ? API_BASE_V1 : ''
}`;
export const WS_API_BASE = `${WEBSOCKET_PROTOCOL}://${RESOLVED_HOST}`;
// Base query with token from Redux
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://hird-app-prod.azurewebsites.net/api/v1',
  // baseUrl: 'https://localhost:7189/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// API Slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: (builder) => ({
    getUser: builder.query<User | null, void>({
      query: () => `/me`,
    }),
    getCompanyDepartments: builder.query<Department, string>({
      query: (companyId) => `/companies/${companyId}/departments`,
    }),
    getCompanyById: builder.query<Company, string>({
      query: (companyId) => `/company/${companyId}`,
    }),
    getAllCompanies: builder.query<SimplifiedCompany[], void>({
      query: () => `/company`,
      transformResponse: (response: Company[]): SimplifiedCompany[] =>
        response.map((c) => ({
          id: c.id,
          name: c.name,
          logo: c.logo,
          departments: c.departments,
        })),
    }),
    getDepartmentMetrics: builder.query<
      MetricsData,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/company/${companyId}/department/${departmentId}/metrics`,
    }),
    getDepartmentStressLevels: builder.query<
      DepartmentStressLevels[],
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/company/${companyId}/department/${departmentId}/stress-levels`,
    }),
    getMentalHealthContributors: builder.query<
      MentalHealthContributorsResponse,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/company/${companyId}/department/${departmentId}/mental-health-contributors`,
    }),
    getWellbeingIndex: builder.query<
      WellbeingIndexResponse,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/company/${companyId}/department/${departmentId}/wellbeing-index`,
    }),
    getENPS: builder.query<
      ENPSResponse,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/company/${companyId}/department/${departmentId}/enps`,
    }),
    getLifeSatisfaction: builder.query<
      LifeSatisfactionResponse,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/company/${companyId}/department/${departmentId}/life-satisfaction`,
    }),
    sendFeedback: builder.mutation<void, FeedbackData>({
      query: (feedback) => ({
        url: '/feedback',
        method: 'POST',
        body: feedback,
      }),
    }),
    createCompany: builder.mutation<
      CreateCompanyResponse,
      CreateCompanyRequest
    >({
      query: (company) => ({
        url: '/company',
        method: 'POST',
        body: company,
      }),
    }),
    updateCompany: builder.mutation<
      Company,
      { id: string; updates: CompanyUpdatePayload }
    >({
      query: ({ id, updates }) => ({
        url: `/company/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    uploadCompanyLogo: builder.mutation<
      void,
      { companyId: string; logo: File }
    >({
      query: ({ companyId, logo }) => {
        const formData = new FormData();
        formData.append('file', logo);

        return {
          url: `/company/${companyId}/upload-logo`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getCompanyLogo: builder.query<string, string>({
      query: (companyId) => `/company/${companyId}/logo`,
    }),
    updateCompanyColor: builder.mutation<
      void,
      { companyId: string; color: string }
    >({
      query: ({ companyId, color }) => ({
        url: `/company/${companyId}/color`,
        method: 'PATCH',
        body: { color },
      }),
    }),
    createCompanySurvey: builder.mutation<null, SurveyTypes>({
      query: (survey) => ({
        url: '/survey/definitions',
        method: 'POST',
        body: survey,
      }),
    }),
    getDepartmentSurvey: builder.query<
      SurveyTypes,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) =>
        `/survey/definitions/admin/${companyId}/${departmentId}`,
    }),
    updateCompanySurvey: builder.mutation<
      SurveyTypes,
      { id: string; survey: SurveyTypes }
    >({
      query: ({ id, survey }) => ({
        url: `/survey/definitions/${id}`,
        method: 'PUT',
        body: survey,
      }),
    }),
    publishCompanySurvey: builder.mutation<SurveyTypes, { id: string }>({
      query: ({ id }) => ({
        url: `/survey/definitions/publish/${id}`,
        method: 'PUT',
      }),
    }),
    // End Survey
    endCompanySurvey: builder.mutation<
      SurveyTypes,
      { surveyId: string; departmentId: string }
    >({
      query: ({ surveyId, departmentId }) => ({
        url: `/survey/definitions/end/${surveyId}/department/${departmentId}`,
        method: 'POST',
        body: { surveyId, departmentId },
      }),
    }),
    // Delete Survey
    deleteCompanySurvey: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/survey/definitions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});
// Auto-generated hooks for the endpoints
export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetCompanyByIdQuery,
  useLazyGetCompanyByIdQuery,
  useGetCompanyDepartmentsQuery,
  useGetDepartmentMetricsQuery,
  useGetDepartmentStressLevelsQuery,
  useGetMentalHealthContributorsQuery,
  useGetWellbeingIndexQuery,
  useGetENPSQuery,
  useGetLifeSatisfactionQuery,
  useSendFeedbackMutation,
  useCreateCompanyMutation,
  useUploadCompanyLogoMutation,
  useGetAllCompaniesQuery,
  useUpdateCompanyColorMutation,
  useGetDepartmentSurveyQuery,
  useUpdateCompanySurveyMutation,
  useGetCompanyLogoQuery,
  useCreateCompanySurveyMutation,
  usePublishCompanySurveyMutation,
  useEndCompanySurveyMutation,
  useDeleteCompanySurveyMutation,
  useUpdateCompanyMutation,
} = apiSlice;
