import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './services/authApi'
import { sellerApi } from './services/sellerApi'
import { productApi } from '@/redux/services/productApi'
import sellerProfileReducer from '@/redux/slices/sellerProfileSlice'
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import storeReducer from "./slices/storeSlice"
import { cartApi } from './services/cartApi'
import { orderApi } from './services/orderApi'
import { pickupApi } from './services/pickupApi'
import { paymentApi } from './services/paymentApi'
import { storeApi } from './services/storeApi'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [pickupApi.reducerPath]: pickupApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    product: productReducer,
    cart: cartReducer,
    sellerProfile: sellerProfileReducer,
    store: storeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      sellerApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      pickupApi.middleware,
      paymentApi.middleware,
      storeApi.middleware
    ),
    devtools: true 
})