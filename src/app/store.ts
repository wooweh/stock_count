import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit"
import { listenerMiddleware } from "./middleware"
import userReducer from "../features/user/userSlice"
import coreReducer from "../features/core/coreSlice"
import orgReducer from "../features/org/orgSlice"
import stockReducer from "../features/stock/stockSlice"
import countReducer from "../features/count/countSlice"
import historyReducer from "../features/history/historySlice"
import { persistReducer, persistStore } from "redux-persist"
import storageSession from "redux-persist/lib/storage/session"
import thunk from "redux-thunk"
/*





*/
const rootReducer = combineReducers({
  core: coreReducer,
  user: userReducer,
  org: orgReducer,
  stock: stockReducer,
  count: countReducer,
  history: historyReducer,
})

const persistConfig = {
  key: "root",
  storage: storageSession,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [listenerMiddleware.middleware, thunk],
})
export const persistor = persistStore(store)
/*





*/
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
