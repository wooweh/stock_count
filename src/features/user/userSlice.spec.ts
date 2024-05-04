import { describe, expect, expectTypeOf, it } from "vitest"
import userReducer, {
  PasswordChangeStatuses,
  UserOrgProps,
  UserProps,
  UserState,
  deleteUser,
  deleteUserOrgDetails,
  setIsSignedIn,
  setPasswordChangeStatus,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgDetails,
} from "./userSlice"
/*




*/
describe("user reducer", () => {
  const initialState: UserState = {
    isSignedIn: false,
    passwordChangeStatus: "notChanged",
    emailChangeStatus: "notChanged",
    user: {},
  }

  const mockState: UserState = {
    isSignedIn: true,
    passwordChangeStatus: "notChanged",
    emailChangeStatus: "notChanged",
    user: {
      uuid: "uuid",
      email: "email",
      name: { first: "first", last: "last" },
      org: {
        uuid: "orgUuid",
        role: "admin",
      },
    },
  }

  it("should handle initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual({
      isSignedIn: false,
      passwordChangeStatus: "notChanged",
      emailChangeStatus: "notChanged",
      user: {},
    })
  })

  it("should handle setIsSignedIn", () => {
    const actual = userReducer(initialState, setIsSignedIn(true))
    expect(actual.isSignedIn).toEqual(true)
    expectTypeOf(actual.isSignedIn).toEqualTypeOf<boolean>()
  })

  it("should handle setUserEmail", () => {
    const mockData = "email@mock.com"
    const actual = userReducer(initialState, setUserEmail({ email: mockData }))
    expect(actual.user.email).toEqual(mockData)
  })

  it("should handle setUserName", () => {
    const mockData = { first: "mockName", last: "mockSurname" }
    const actual = userReducer(initialState, setUserName(mockData))
    expect(actual.user.name).toEqual(mockData)
  })

  it("should handle setUserOrgDetails", () => {
    const mockData: UserOrgProps = {
      uuid: "mockOrgUuid",
      role: "admin",
    }
    const actual = userReducer(initialState, setUserOrgDetails(mockData))
    expect(actual.user.org).toEqual(mockData)
  })

  it("should handle deleteUserOrgDetails", () => {
    const actual = userReducer(mockState, deleteUserOrgDetails())
    expect(actual.user.org).toEqual(undefined)
  })

  it("should handle setPasswordChangeStatus", () => {
    const mockStatus: PasswordChangeStatuses = "isSuccess"
    const actual = userReducer(mockState, setPasswordChangeStatus(mockStatus))
    expect(actual.passwordChangeStatus).toEqual(mockStatus)
    expectTypeOf(
      actual.passwordChangeStatus,
    ).toEqualTypeOf<PasswordChangeStatuses>()
  })

  it("should handle setUser", () => {
    const mockPayload: UserProps = {
      uuid: "1234",
      name: {
        first: "first",
        last: "last",
      },
      email: "email",
      org: {
        uuid: "orgUuid",
        role: "admin",
      },
    }
    const actual = userReducer(
      initialState,
      setUser({ user: mockPayload, updateDB: true }),
    )
    expect(actual.user).toEqual(mockPayload)
    expectTypeOf(actual.user).toEqualTypeOf<UserProps>()
  })

  it("should handle deleteUser", () => {
    const actual = userReducer(
      mockState,
      deleteUser({ uuid: "uuid", password: "password" }),
    )
    expect(actual.user).toEqual({})
  })
})
