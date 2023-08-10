import userReducer, {
  UserOnBootProps,
  UserState,
  deleteUser,
  deleteUserOrgDetails,
  setUserEmail,
  setUserName,
  setUser,
  setUserOrgRole,
  setUserOrgUuid,
  setUserSurname,
  signIn,
  signOut,
} from "./userSlice"

describe("user reducer", () => {
  const initialState: UserState = {
    isSignedIn: false,
    user: {},
  }

  const mockState: UserState = {
    isSignedIn: true,
    user: {
      uuid: "uuid",
      email: "email",
      name: "name",
      surname: "surname",
      orgUuid: "orgUuid",
      orgRole: "admin",
    },
  }

  it("should handle initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual({
      isSignedIn: false,
      user: {},
    })
  })

  it("should handle signIn", () => {
    const actual = userReducer(initialState, signIn())
    expect(actual.isSignedIn).toEqual(true)
  })

  it("should handle signOut", () => {
    const actual = userReducer(initialState, signOut())
    expect(actual.isSignedIn).toEqual(false)
  })

  it("should handle setUserEmail", () => {
    const mockData = "mockData"
    const actual = userReducer(initialState, setUserEmail(mockData))
    expect(actual.user.email).toEqual(mockData)
  })

  it("should handle setUserName", () => {
    const mockData = "mockData"
    const actual = userReducer(initialState, setUserName(mockData))
    expect(actual.user.name).toEqual(mockData)
  })

  it("should handle setUserSurname", () => {
    const mockData = "mockData"
    const actual = userReducer(initialState, setUserSurname(mockData))
    expect(actual.user.surname).toEqual(mockData)
  })

  it("should handle setUserOrgUuid", () => {
    const mockData = "mockData"
    const actual = userReducer(initialState, setUserOrgUuid(mockData))
    expect(actual.user.orgUuid).toEqual(mockData)
  })

  it("should handle setUserOrgRole", () => {
    const mockData = "admin"
    const actual = userReducer(initialState, setUserOrgRole(mockData))
    expect(actual.user.orgRole).toEqual(mockData)
  })

  it("should handle setUser", () => {
    const mockPayload: UserOnBootProps = {
      uuid: "1234",
      name: "name",
      surname: "surname",
      email: "email",
      orgUuid: "1234",
      orgRole: "admin",
    }
    const actual = userReducer(initialState, setUser(mockPayload))
    expect(actual.user).toEqual(mockPayload)
  })

  it("should handle deleteUserOrgDetails", () => {
    const actual = userReducer(mockState, deleteUserOrgDetails())
    expect(actual.user.orgRole).toEqual(undefined)
    expect(actual.user.orgUuid).toEqual(undefined)
  })

  it("should handle deleteUser", () => {
    const actual = userReducer(mockState, deleteUser())
    expect(actual.user).toEqual({})
  })
})
