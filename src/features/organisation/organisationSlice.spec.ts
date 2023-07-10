import organisationReducer, {
  MemberNameProps,
  MemberRoleProps,
  MemberSurnameProps,
  MembersProps,
  OrgProps,
  OrganisationState,
  createOrg,
  deleteOrg,
  setOrgMemberName,
  setOrgMemberRole,
  setOrgMemberSurname,
  setOrgName,
  setOrg,
  setMemberStatus,
  MemberStatusOptions,
  leaveOrg,
  InviteProps,
  createInvite,
  InvitesProps,
  deleteInvite,
  deleteOrgMember,
} from "./organisationSlice"
import { v4 as uuidv4 } from "uuid"

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
          name: "memberName",
          surname: "memberSurname",
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

  it("should handle setOrgMemberName", () => {
    const mockData: MemberNameProps = { uuid: "mockUuid", name: "mockData" }
    const actual = organisationReducer(mockState, setOrgMemberName(mockData))
    const members = actual.org.members as MembersProps
    expect(members[mockData.uuid].name).toEqual(mockData.name)
  })

  it("should handle setOrgMemberSurname", () => {
    const mockData: MemberSurnameProps = {
      uuid: "mockUuid",
      surname: "mockData",
    }
    const actual = organisationReducer(mockState, setOrgMemberSurname(mockData))
    const members = actual.org.members as MembersProps
    expect(members[mockData.uuid].surname).toEqual(mockData.surname)
  })

  it("should handle setOrgMemberRole", () => {
    const mockData: MemberRoleProps = { uuid: "mockUuid", role: "member" }
    const actual = organisationReducer(mockState, setOrgMemberRole(mockData))
    const members = actual.org.members as MembersProps
    expect(members[mockData.uuid].role).toEqual(mockData.role)
  })

  it("should handle deleteOrgMember", () => {
    const mockData: string = "mockUuid"
    const actual = organisationReducer(mockState, deleteOrgMember(mockData))
    const members = actual.org.members as MembersProps
    expect(members[mockData]).toBe(undefined)
  })

  it("should handle createInvite", () => {
    const mockData: InviteProps = {
      inviteKey: "mockInviteKey2",
      tempName: "mockTempName2",
    }
    const actual = organisationReducer(mockState, createInvite(mockData))
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
    const actual = organisationReducer(mockState, deleteOrg())
    expect(actual.org).toEqual({})
  })

  it("should handle leaveOrg", () => {
    const actual = organisationReducer(mockState, leaveOrg())
    expect(actual.org).toEqual({})
  })

  it("should handle setMemberStatus", () => {
    const mockPayload: MemberStatusOptions = "joining"
    const actual = organisationReducer(mockState, setMemberStatus(mockPayload))
    expect(actual.memberStatus).toEqual(mockPayload)
  })
})
