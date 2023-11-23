import { ORDERS_URL } from '../constants'
import { apiSlice } from './apiSlice'
import { userApiSlice } from './usersApiSlice'

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),
  }),
})

export const { useCreateOrderMutation } = userApiSlice
