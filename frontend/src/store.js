import {
  configureStore,
  combineReducers,
  applyMiddleware,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import {
  productListReducer,
  productDetailsReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItem'))
  : []

const initialState = {
  cart: { cartItems: cartItemsFromStorage },
}

const middleware = [thunk]

const store = configureStore(
  { reducer: reducer },
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
