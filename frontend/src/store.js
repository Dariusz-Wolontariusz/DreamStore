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
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
})

const initialState = {}

const middleware = [thunk]

const store = configureStore(
  { reducer: reducer },
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
