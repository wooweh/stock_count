import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export type UserOnBootProps = UserProps
export type UserOrgRoles = "admin" | "member"
export type UserProps = {
  uuid?: string
  email?: string
  name?: string
  surname?: string
  orgUuid?: string | undefined
  orgRole?: UserOrgRoles | undefined
}

export interface UserState {
  isLoggedIn: boolean
  user: UserProps
}

const initialState: UserState = {
  isLoggedIn: false,
  user: {},
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state) => {
      console.log("signed in")
      state.isLoggedIn = true
    },
    signOut: (state) => {
      state.isLoggedIn = false
    },
    setUser: (state, action: PayloadAction<UserProps>) => {
      state.user = action.payload
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.user.name = action.payload
    },
    setUserSurname: (state, action: PayloadAction<string>) => {
      state.user.surname = action.payload
    },
    setUserOrgUuid: (state, action: PayloadAction<string>) => {
      state.user.orgUuid = action.payload
    },
    setUserOrgRole: (state, action: PayloadAction<UserOrgRoles>) => {
      state.user.orgRole = action.payload
    },
    deleteUserOrgDetails: (state) => {
      delete state.user.orgRole
      delete state.user.orgUuid
    },
    deleteUser: (state) => {
      state.isLoggedIn = false
      state.user = {}
    },
  },
})

export const {
  signIn,
  signOut,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgUuid,
  setUserOrgRole,
  setUserSurname,
  deleteUserOrgDetails,
  deleteUser,
} = userSlice.actions

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn
export const selectUser = (state: RootState) => state.user.user
export const selectUserUuid = (state: RootState) => state.user.user.uuid
export const selectUserOrgRole = (state: RootState) => state.user.user.orgRole
export const selectUserOrgUuid = (state: RootState) => state.user.user.orgUuid
export const selectIsUserAdmin = (state: RootState) =>
  state.user.user.orgRole === "admin"
export const selectIsProfileComplete = (state: RootState) =>
  state.user.user.name && state.user.user.surname

export default userSlice.reducer
