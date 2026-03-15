import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Store"],
  endpoints: (builder) => ({
    createStore: builder.mutation({
      query: (data) => ({
        url: "/store",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    updateMyStore: builder.mutation({
      query: (data) => ({
        url: "/store/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    getMyStore: builder.query({
      query: () => "/store/me",
      providesTags: ["Store"],
    }),

    getStoreBySlug: builder.query({
      query: (slug) => `/store/${slug}`,
    }),
  }),
});

export const {
  useCreateStoreMutation,
  useUpdateMyStoreMutation,
  useGetMyStoreQuery,
  useGetStoreBySlugQuery,
} = storeApi