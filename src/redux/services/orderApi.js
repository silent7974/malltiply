import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    createGuestOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders/guest',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `/orders/${orderId}`,
        method: 'PATCH',
        body: { orderStatus },
      }),
      invalidatesTags: ['Order'],
    }),

    getBuyerOrders: builder.query({
      query: () => "/orders/buyer",
      providesTags: ["Order"],
    }),

    getGuestOrders: builder.mutation({
      query: (orderIds) => ({
        url: '/orders/guest-lookup',
        method: 'POST',
        body: { orderIds },
      }),
    }),

  }),
});


export const { 
  useCreateOrderMutation,
  useCreateGuestOrderMutation, 
  useGetOrdersQuery, 
  useGetOrderByIdQuery, 
  useUpdateOrderStatusMutation, 
  useGetBuyerOrdersQuery,
  useGetGuestOrdersMutation
  
} = orderApi