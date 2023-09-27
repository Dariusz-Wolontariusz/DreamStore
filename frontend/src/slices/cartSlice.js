import { createSlice } from '@reduxjs/toolkit'

// checks local storage for existing items in a cart
// added itemPrice: [] because of error

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] }

// helper function to round the number to specific number of decimals

const addDecimals = (num) => Math.round((num * 100) / 100).toFixed(2)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // item to be added to the cart
      const item = action.payload

      // check if the item is already in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id)

      if (existItem) {
        // if it exists, update qty
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        )
      } else {
        // if not, add new item to the cart
        state.cartItems = [...state.cartItems, item]
      }

      // calculate the items price

      state.itemsPrice = addDecimals(
        state.cartItems.reduce(
          (total, item) => total + item.price * item.qty,
          0
        )
      )

      // calculate shipping cost (if higher than 100 € then free shipping)

      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100)

      // calculate tax price (25%)

      state.taxPrice = addDecimals(Number((state.itemsPrice * 0.25).toFixed(2)))

      // calculate total price

      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2)

      // save cart to the localStorage
      localStorage.setItem('cart', JSON.stringify(state))
    },
  },
})

export const { addToCart } = cartSlice.actions

export default cartSlice.reducer
