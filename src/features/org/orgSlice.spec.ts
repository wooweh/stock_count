import { describe, expect, expectTypeOf, it } from "vitest"
import orgReducer, {
  InviteProps,
  InvitesProps,
  MemberProps,
  MemberStatuses,
  MembersProps,
  OrgState,
  deleteInvite,
  deleteOrg,
  deleteOrgMember,
  setInvite,
  setMemberStatus,
  setOrg,
  setOrgMember,
  setOrgName,
} from "./orgSlice"
/*




*/
describe("org reducer", () => {
  const initialState: OrgState = {
    memberStatus: "notJoined",
    org: {},
  }
  const mockState: OrgState = {
    memberStatus: "notJoined",
    org: {
      name: "name",
      uuid: "uuid",
      members: {
        mockUuid: {
          firstName: "name",
          lastName: "surname",
          role: "admin",
          uuid: "mockUuid",
        },
      },
      invites: {
        mockInviteKey: "mockTempName",
        mockInviteKey1: "mockTempName1",
      },
    },
  }

  it("should handle initial state", () => {
    expect(orgReducer(undefined, { type: "unknown" })).toEqual({
      memberStatus: "notJoined",
      org: {},
    })
  })

  it("should handle setMemberStatus", () => {
    const mockData = "isJoined"
    const actual = orgReducer(initialState, setMemberStatus(mockData))
    expect(actual.memberStatus).toEqual(mockData)
    expectTypeOf(actual.memberStatus).toEqualTypeOf<MemberStatuses>()
  })

  it("should handle setOrg", () => {
    const mockPayload = {
      uuid: "uuid",
      name: "name",
      members: mockState.org.members,
    }
    const actual = orgReducer(
      initialState,
      setOrg({ org: mockPayload, updateDB: false }),
    )
    expect(actual.org.name).toEqual(mockPayload.name)
    expect(actual.org.uuid).toEqual(mockPayload.uuid)
    expect(actual.org.members).toEqual(mockPayload.members)
  })

  it("should handle deleteOrg", () => {
    const mockUuid = mockState.org.uuid as string
    const actual = orgReducer(mockState, deleteOrg({ uuid: mockUuid }))
    expect(actual.org).toEqual({})
  })

  it("should handle setOrgName", () => {
    const mockData = "mockData"
    const actual = orgReducer(initialState, setOrgName(mockData))
    expect(actual.org.name).toEqual(mockData)
  })

  it("should handle setOrgMember", () => {
    const member: MemberProps = {
      uuid: "mockUuid",
      firstName: "mockName",
      lastName: "mockSurname",
      role: "admin",
    }
    const orgUuid = mockState.org.uuid as string
    const actual = orgReducer(mockState, setOrgMember({ member, orgUuid }))
    const members = actual.org.members as MembersProps
    expect(members[member.uuid].firstName).toEqual(member.firstName)
    expectTypeOf(members[member.uuid]).toEqualTypeOf<MemberProps>()
  })

  it("should handle deleteOrgMember", () => {
    const memberUuid: string = "mockUuid"
    const orgUuid = mockState.org.uuid as string
    const actual = orgReducer(
      mockState,
      deleteOrgMember({ memberUuid, orgUuid }),
    )
    const members = actual.org.members as MembersProps
    expect(members[memberUuid]).toBe(undefined)
  })

  it("should handle setInvite", () => {
    const mockData: InviteProps = {
      inviteKey: "mockInviteKey2",
      tempName: "mockTempName2",
    }
    const actual = orgReducer(mockState, setInvite(mockData))
    const invites = actual.org.invites as InvitesProps
    const inviteKey = mockData.inviteKey
    expect(invites[inviteKey]).toEqual(mockData.tempName)
    expectTypeOf(invites[inviteKey]).toEqualTypeOf<string>()
  })

  it("should handle deleteInvite", () => {
    const inviteKey = "mockInviteKey1"
    const actual = orgReducer(mockState, deleteInvite({ inviteKey }))
    const invites = actual.org.invites as InvitesProps
    expect(invites[inviteKey]).toBe(undefined)
  })
})
