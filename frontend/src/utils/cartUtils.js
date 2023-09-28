// helper function to round the number to specific number of decimals

export const addDecimals = (num) => Math.round((num * 100) / 100).toFixed(2)

export const updateCart = (state) => {
  // calculate the items price

  state.itemsPrice = addDecimals(
    state.cartItems.reduce((total, item) => total + item.price * item.qty, 0)
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

  return state
}
