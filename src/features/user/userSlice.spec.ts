import userReducer, { UserState, logIn } from "./userSlice"

describe("user reducer", () => {
  const initialState: UserState = {
    isLoggedIn: false,
  }
  it("should handle initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual({
      isLoggedIn: false,
    })
  })

  it("should handle logIn", () => {
    const actual = userReducer(initialState, logIn())
    expect(actual.isLoggedIn).toEqual(true)
  })
})
