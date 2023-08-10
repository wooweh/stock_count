import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export type NotificationTypes = "success" | "info" | "warning" | "error"
export type NotificationProps = {
  uuid: string
  type: NotificationTypes
  message: string
}
export type SystemStatusProps = "notBooted" | "isBooting" | "isBooted"

export interface CoreState {
  systemStatus: SystemStatusProps
  isDarkmode: boolean
  isMobile: boolean
  showNotification: boolean
  notificaiton: NotificationProps | undefined
}

const initialState: CoreState = {
  systemStatus: "notBooted",
  isDarkmode: true,
  isMobile: false,
  showNotification: false,
  notificaiton: undefined,
}

export const coreSlice = createSlice({
  name: "core",
  initialState,
  reducers: {
    setSystemStatus: (state, action: PayloadAction<SystemStatusProps>) => {
      state.systemStatus = action.payload
    },
    resetSystem: (state) => {
      state.systemStatus = "notBooted"
    },
    toggleIsDarkmode: (state) => {
      state.isDarkmode = !state.isDarkmode
    },
    toggleIsMobile: (state) => {
      state.isMobile = !state.isMobile
    },
    showNotification: (state, action: PayloadAction<NotificationProps>) => {
      state.showNotification = true
      state.notificaiton = action.payload
    },
    hideNotification: (state) => {
      state.showNotification = false
      state.notificaiton = undefined
    },
  },
})

export const {
  setSystemStatus,
  resetSystem,
  toggleIsDarkmode,
  toggleIsMobile,
  showNotification,
  hideNotification,
} = coreSlice.actions

export const selectIsMobile = (state: RootState) => state.core.isMobile
export const selectIsDarkmode = (state: RootState) => state.core.isDarkmode
export const selectShowNotification = (state: RootState) =>
  state.core.showNotification
export const selectNotification = (state: RootState) => state.core.notificaiton
export const selectIsSystemBooted = (state: RootState) =>
  state.core.systemStatus === "isBooted"
export const selectIsSystemBooting = (state: RootState) =>
  state.core.systemStatus === "isBooting"
export const selectIsSystemActive = createSelector(
  [selectIsSystemBooted, selectIsSystemBooting],
  (isBooted, isBooting) => {
    return isBooted || isBooting
  },
)

export default coreSlice.reducer
