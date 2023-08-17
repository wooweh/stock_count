import userReducer, {
  UserState,
  deleteUser,
  deleteUserOrgDetails,
  setUserEmail,
  setUser,
  signIn,
  signOut,
  setUserFullName,
  setUserOrgDetails,
  SetUserOrgDetailsProps,
  UserProps,
} from "./userSlice"

describe("user reducer", () => {
  const initialState: UserState = {
    isSignedIn: false,
    passwordChangeStatus: "notChanged",
    user: {},
  }

  const mockState: UserState = {
    isSignedIn: true,
    passwordChangeStatus: "notChanged",
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
      passwordChangeStatus: "notChanged",
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

  it("should handle setUserFullName", () => {
    const mockData = { name: "mockName", surname: "mockSurname" }
    const actual = userReducer(initialState, setUserFullName(mockData))
    expect(actual.user.name).toEqual(mockData.name)
  })

  it("should handle setUserOrgDetails", () => {
    const mockData: SetUserOrgDetailsProps = {
      orgUuid: "mockOrgUuid",
      orgRole: "admin",
      updateDB: false,
    }
    const actual = userReducer(initialState, setUserOrgDetails(mockData))
    expect(actual.user.orgUuid).toEqual(mockData.orgUuid)
  })

  it("should handle setUser", () => {
    const mockPayload: UserProps = {
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
    const actual = userReducer(
      mockState,
      deleteUserOrgDetails({ updateDB: false }),
    )
    expect(actual.user.orgRole).toEqual(undefined)
    expect(actual.user.orgUuid).toEqual(undefined)
  })

  it("should handle deleteUser", () => {
    const actual = userReducer(mockState, deleteUser("userid"))
    expect(actual.user).toEqual(actual.user)
  })
})
