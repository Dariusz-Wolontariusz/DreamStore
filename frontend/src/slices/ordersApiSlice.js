import { ORDERS_URL, PAYPAL_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedData: 5,
    }),
    payOrder: builder.mutation({
      // arguments are in curly braces, because they need to be destructored

      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      //// way to log payers details
      // onQueryStarted: (arg, { dispatch, queryFulfilled, queryRejected }) => {
      //   console.log('Details sent to payOrder endpoint:', arg.details)
      // },
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
} = orderApiSlice
