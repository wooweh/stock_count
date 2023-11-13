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
    toggleIsDarkmode: (state) => {
      state.isDarkmode = !state.isDarkmode
    },
    toggleIsMobile: (state) => {
      state.isMobile = !state.isMobile
    },
    setShowNotification: (state, action: PayloadAction<boolean>) => {
      state.showNotification = action.payload
    },
    setNotification: (
      state,
      action: PayloadAction<NotificationProps | undefined>,
    ) => {
      state.notificaiton = action.payload
    },
  },
})

export const {
  setSystemStatus,
  toggleIsDarkmode,
  toggleIsMobile,
  setShowNotification,
  setNotification,
} = coreSlice.actions

export const coreSelector = (state: RootState) => state.core

export default coreSlice.reducer
