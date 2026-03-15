import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/api/seller",
    credentials: "include",
   }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (payload) => ({
        url: "/signup",
        method: "POST",
        body: payload,
      }),
    }),
    signin: builder.mutation({
      query: (payload) => ({
        url: "/signin",
        method: "POST",
        body: payload,
      }),
    }),
    getProfile: builder.query({
      query: () => "/profile",
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: "/profile",
        method: "PUT",
        body: payload,
      }),
    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: "/profile/password",
        method: "PATCH",
        body: payload,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/profile",
        method: "DELETE",
      })
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = sellerApi;