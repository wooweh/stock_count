import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface UserState {
  isLoggedIn: boolean
}

const initialState: UserState = {
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true
    },
  },
})

export const { logIn } = userSlice.actions

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn

export default userSlice.reducer
