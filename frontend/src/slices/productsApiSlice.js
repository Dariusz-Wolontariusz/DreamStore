import { PRODUCTS_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      // no need to send data because it will create sample product to edit
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      // this will prevent it to be cached
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
} = productsApiSlice
