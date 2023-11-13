import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
/*




*/
export type SetUserProps = UpdateDB & {
  user: UserProps
}
export type UserProps = {
  uuid?: string
  email?: string
  name?: UserNameProps
  org?: UserOrgProps
}
export type UpdateDB = { updateDB: boolean }
export type DeleteUserProps = { uuid: string; password: string }
export type PasswordChangeStatuses =
  | "notChanged"
  | "isPending"
  | "isSuccess"
  | "isFailed"
export type UserNameProps = {
  first: string
  last: string
}
export type UserOrgProps = {
  uuid: string
  role: UserOrgRoles
}
export type UserOrgRoles = "admin" | "member"
export type SetEmailProps = {
  email: string
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
    setIsSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload
    },
    setUserEmail: (state, action: PayloadAction<SetEmailProps>) => {
      state.user.email = action.payload.email
    },
    setUserName: (state, action: PayloadAction<UserNameProps>) => {
      const name = action.payload
      state.user.name = name
    },
    setUserOrgDetails: (state, action: PayloadAction<UserOrgProps>) => {
      state.user.org = action.payload
    },
    deleteUserOrgDetails: (state) => {
      delete state.user.org
    },
    setPasswordChangeStatus: (
      state,
      action: PayloadAction<PasswordChangeStatuses>,
    ) => {
      state.passwordChangeStatus = action.payload
    },
    setUser: (state, action: PayloadAction<SetUserProps>) => {
      state.user = action.payload.user
    },
    deleteUser: (state, action: PayloadAction<DeleteUserProps>) => {
      state.user = {}
    },
  },
})

export const {
  setIsSignedIn,
  setUserEmail,
  setUserName,
  setUserOrgDetails,
  deleteUserOrgDetails,
  setPasswordChangeStatus,
  setUser,
  deleteUser,
} = userSlice.actions

export const userSelector = (state: RootState) => state.user

export default userSlice.reducer
