import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export type NotificationTypes = "success" | "info" | "error"
export type NotificationProps = {
  uuid: string
  type: NotificationTypes
  message: string
}

export interface CoreState {
  isSystemBooted: boolean
  isDarkmode: boolean
  isMobile: boolean
  showNotification: boolean
  notificaiton: NotificationProps | undefined
}

const initialState: CoreState = {
  isSystemBooted: false,
  isDarkmode: true,
  isMobile: false,
  showNotification: false,
  notificaiton: undefined,
}

export const coreSlice = createSlice({
  name: "core",
  initialState,
  reducers: {
    bootSystem: (state) => {
      state.isSystemBooted = true
    },
    resetSystem: (state) => {
      state.isSystemBooted = false
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
  bootSystem,
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
  state.core.isSystemBooted

export default coreSlice.reducer
