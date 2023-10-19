import { v4 as uuidv4 } from "uuid"
import organisationReducer, {
  InviteProps,
  InvitesProps,
  MemberProps,
  MemberStatuses,
  MembersProps,
  OrgProps,
  OrganisationState,
  setInvite,
  createOrg,
  deleteInvite,
  deleteOrg,
  deleteOrgMember,
  leaveOrg,
  setMemberStatus,
  setOrg,
  setOrgMember,
  setOrgName,
} from "./organisationSlice"

describe("organisation reducer", () => {
  const initialState: OrganisationState = {
    memberStatus: "notJoined",
    org: {},
  }
  const mockState: OrganisationState = {
    memberStatus: "notJoined",
    org: {
      name: "name",
      uuid: "uuid",
      members: {
        mockUuid: {
          name: "name",
          surname: "surname",
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
    expect(organisationReducer(undefined, { type: "unknown" })).toEqual({
      memberStatus: "notJoined",
      org: {},
    })
  })

  it("should handle createOrg", () => {
    const uuid = uuidv4()
    const testPayload: OrgProps = {
      name: "Org Name",
      uuid: uuid,
      members: {
        mockUuid: {
          firstName: "memberName",
          lastName: "memberSurname",
          role: "admin",
          uuid: "mockUuid",
        },
      },
    }
    const actual = organisationReducer(initialState, createOrg(testPayload))
    expect(actual.org).toEqual(testPayload)
  })

  it("should handle setOrgName", () => {
    const mockData = "mockData"
    const actual = organisationReducer(initialState, setOrgName(mockData))
    expect(actual.org.name).toEqual(mockData)
  })

  it("should handle setOrgMember", () => {
    const mockData: MemberProps = {
      uuid: "mockUuid",
      firstName: "mockName",
      lastName: "mockSurname",
      role: "admin",
    }
    const actual = organisationReducer(mockState, setOrgMember(mockData))
    const members = actual.org.members as MembersProps
    expect(members[mockData.uuid].firstName).toEqual(mockData.firstName)
  })

  it("should handle deleteOrgMember", () => {
    const mockData: string = "mockUuid"
    const actual = organisationReducer(mockState, deleteOrgMember(mockData))
    const members = actual.org.members as MembersProps
    expect(members[mockData]).toBe(undefined)
  })

  it("should handle setInvite", () => {
    const mockData: InviteProps = {
      inviteKey: "mockInviteKey2",
      tempName: "mockTempName2",
    }
    const actual = organisationReducer(mockState, setInvite(mockData))
    const invites = actual.org.invites as InvitesProps
    expect(invites[mockData.inviteKey]).toEqual(mockData.tempName)
  })

  it("should handle deleteInvite", () => {
    const inviteKey = "mockInviteKey1"
    const actual = organisationReducer(mockState, deleteInvite(inviteKey))
    const invites = actual.org.invites as InvitesProps
    expect(invites[inviteKey]).toBe(undefined)
  })

  it("should handle setOrg", () => {
    const mockPayload = {
      uuid: "uuid",
      name: "name",
      members: mockState.org.members,
    }
    const actual = organisationReducer(initialState, setOrg(mockPayload))
    expect(actual.org.name).toEqual(mockPayload.name)
    expect(actual.org.uuid).toEqual(mockPayload.uuid)
    expect(actual.org.members).toEqual(mockPayload.members)
  })

  it("should handle deleteOrg", () => {
    const actual = organisationReducer(mockState, deleteOrg(mockState.org))
    expect(actual.org).toEqual({})
  })

  it("should handle leaveOrg", () => {
    const actual = organisationReducer(mockState, leaveOrg("uuid"))
    expect(actual.org).toEqual({})
  })

  it("should handle setMemberStatus", () => {
    const mockPayload: MemberStatuses = "joining"
    const actual = organisationReducer(mockState, setMemberStatus(mockPayload))
    expect(actual.memberStatus).toEqual(mockPayload)
  })
})
