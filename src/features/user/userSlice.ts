import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export type UpdateDB = { updateDB: boolean }
export type UserOrgRoles = "admin" | "member"
export type UserProps = {
  uuid?: string
  email?: string
  name?: string
  surname?: string
  orgUuid?: string
  orgRole?: UserOrgRoles
}
export type PasswordChangeStatuses =
  | "notChanged"
  | "isPending"
  | "isSuccess"
  | "isFailed"
export type UserFullNameProps = {
  name: string
  surname: string
}
export type SetUserOrgDetailsProps = UpdateDB & {
  orgUuid: string
  orgRole: UserOrgRoles
}

export type ChangeUserPasswordProps = {
  password: string
  newPassword: string
}

export interface UserState {
  isSignedIn: boolean
  passwordChangeStatus: PasswordChangeStatuses
  user: UserProps
}

const initialState: UserState = {
  isSignedIn: false,
  passwordChangeStatus: "notChanged",
  user: {},
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state) => {
      console.log("signed in")
      state.isSignedIn = true
    },
    signOut: (state) => {
      state.isSignedIn = false
    },
    setUser: (state, action: PayloadAction<UserProps>) => {
      state.user = action.payload
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload
    },
    setUserFullName: (state, action: PayloadAction<UserFullNameProps>) => {
      const name = action.payload.name
      const surname = action.payload.surname
      state.user.name = name
      state.user.surname = surname
    },
    setUserOrgDetails: (
      state,
      action: PayloadAction<SetUserOrgDetailsProps>,
    ) => {
      const orgUuid = action.payload.orgUuid
      const orgRole = action.payload.orgRole
      state.user.orgUuid = orgUuid
      state.user.orgRole = orgRole
    },
    deleteUserOrgDetails: (state, action: PayloadAction<UpdateDB>) => {
      delete state.user.orgRole
      delete state.user.orgUuid
    },
    changeUserPassword: (
      state,
      action: PayloadAction<ChangeUserPasswordProps>,
    ) => {
      state.passwordChangeStatus = "isPending"
    },
    setPasswordChangeStatus: (
      state,
      action: PayloadAction<PasswordChangeStatuses>,
    ) => {
      state.passwordChangeStatus = action.payload
    },
    deleteUser: (state, action: PayloadAction<string>) => {},
  },
})

export const {
  signIn,
  signOut,
  setUser,
  setUserEmail,
  setUserFullName,
  setUserOrgDetails,
  deleteUserOrgDetails,
  changeUserPassword,
  setPasswordChangeStatus,
  deleteUser,
} = userSlice.actions

export const selectIsSignedIn = (state: RootState) => state.user.isSignedIn
export const selectUser = (state: RootState) => state.user.user
export const selectUserName = (state: RootState) => state.user.user.name
export const selectUserSurname = (state: RootState) => state.user.user.surname
export const selectUserEmail = (state: RootState) => state.user.user.email
export const selectUserUuid = (state: RootState) =>
  state.user.user.uuid as string
export const selectUserOrgRole = (state: RootState) => state.user.user.orgRole
export const selectUserOrgUuid = (state: RootState) => state.user.user.orgUuid
export const selectIsLocalUserOrgDetails = createSelector(
  [selectUserOrgRole, selectUserOrgUuid],
  (orgRole: any, orgUuid: any) => {
    return !!orgRole && !!orgUuid
  },
)
export const selectIsPasswordChangeFailed = (state: RootState) =>
  state.user.passwordChangeStatus === "isFailed"
export const selectIsPasswordChangeSuccess = (state: RootState) =>
  state.user.passwordChangeStatus === "isSuccess"
export const selectIsPasswordChangePending = (state: RootState) =>
  state.user.passwordChangeStatus === "isPending"
export const selectIsUserAdmin = (state: RootState) =>
  state.user.user.orgRole === "admin"
export const selectIsProfileComplete = (state: RootState) =>
  state.user.user.name && state.user.user.surname

export default userSlice.reducer
