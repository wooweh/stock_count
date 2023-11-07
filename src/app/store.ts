import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storageSession from "redux-persist/lib/storage/session"
import thunk from "redux-thunk"
import coreReducer from "../features/core/coreSlice"
import countReducer from "../features/count/countSlice"
import { countListenerMiddleware } from "../features/count/countSliceEffects"
import historyReducer from "../features/history/historySlice"
import { historyListenerMiddleware } from "../features/history/historySliceEffects"
import orgReducer from "../features/org/orgSlice"
import { orgListenerMiddleware } from "../features/org/orgSliceEffects"
import stockReducer from "../features/stock/stockSlice"
import { stockListenerMiddleware } from "../features/stock/stockSliceEffects"
import userReducer from "../features/user/userSlice"
import { userListenerMiddleware } from "../features/user/userSliceEffects"
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
const middleware = [
  userListenerMiddleware.middleware,
  orgListenerMiddleware.middleware,
  stockListenerMiddleware.middleware,
  countListenerMiddleware.middleware,
  historyListenerMiddleware.middleware,
]

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [...middleware, thunk],
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
