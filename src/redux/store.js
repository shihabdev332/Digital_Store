import { configureStore } from '@reduxjs/toolkit'
import digitalReducer from "./digitalSlice"
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist"

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, digitalReducer)

export const store = configureStore({
  reducer: {
   digital: persistedReducer,
  },
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH, REHYDRATE, PAUSE, REGISTER, PERSIST]
      }
    })
})
  
export let persistor = persistStore(store)