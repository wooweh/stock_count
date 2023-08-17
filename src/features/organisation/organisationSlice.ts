import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState, store } from "../../app/store"
import { UserOrgRoles } from "../user/userSlice"
import { selectCountMembers } from "../count/countSlice"

export type OrgProps = {
  name?: string
  uuid?: string
  members?: MembersProps
  invites?: InvitesProps
}
export type MemberProps = {
  name: string
  surname: string
  role: UserOrgRoles
  uuid: string
}
export type MembersProps = {
  [key: string]: MemberProps
}
export type MemberStatusOptions = "notJoined" | "joining" | "isJoined"
export type InvitesProps = { [key: string]: string }
export type InviteProps = { inviteKey: string; tempName: string }

export interface OrganisationState {
  memberStatus: MemberStatusOptions
  org: OrgProps
}

const initialState: OrganisationState = {
  memberStatus: "notJoined",
  org: {},
}

export const organisationSlice = createSlice({
  name: "organisation",
  initialState,
  reducers: {
    createOrg: (state, action: PayloadAction<OrgProps>) => {
      state.org = action.payload
      state.memberStatus = "isJoined"
    },
    joinOrg: (state, action: PayloadAction<string>) => {
      state.memberStatus = "joining"
    },
    setOrg: (state, action: PayloadAction<OrgProps>) => {
      state.org = action.payload
    },
    deleteOrg: (state, action: PayloadAction<OrgProps>) => {
      state.org = {}
      state.memberStatus = "notJoined"
    },
    leaveOrg: (state, action: PayloadAction<string>) => {
      state.org = {}
      state.memberStatus = "notJoined"
    },
    setOrgName: (state, action: PayloadAction<string>) => {
      state.org.name = action.payload
    },
    setOrgMember: (state, action: PayloadAction<MemberProps>) => {
      const memberUuid = action.payload.uuid
      const members = state.org.members
      const member = action.payload

      if (members) {
        members[memberUuid] = member
      }
    },
    deleteOrgMember: (state, action: PayloadAction<string>) => {
      const memberUuid = action.payload
      const members = state.org.members

      if (members) {
        delete members[memberUuid]
      }
    },
    setMemberStatus: (state, action: PayloadAction<MemberStatusOptions>) => {
      state.memberStatus = action.payload
    },
    createInvite: (state, action: PayloadAction<InviteProps>) => {
      const inviteKey = action.payload.inviteKey
      const tempName = action.payload.tempName
      _.set(state.org, `invites.${inviteKey}`, tempName)
    },
    deleteInvite: (state, action: PayloadAction<string>) => {
      const inviteKey = action.payload
      const invites = state.org.invites
      if (invites && inviteKey in invites) {
        delete invites[inviteKey]
      }
    },
  },
})

export const {
  createOrg,
  joinOrg,
  setOrg,
  setOrgName,
  setOrgMember,
  deleteOrgMember,
  setMemberStatus,
  deleteOrg,
  leaveOrg,
  createInvite,
  deleteInvite,
} = organisationSlice.actions

export const selectIsJoining = (state: RootState) => {
  return state.organisation.memberStatus === "joining"
}
export const selectIsJoined = (state: RootState) => {
  return state.organisation.memberStatus === "isJoined"
}
export const selectOrg = (state: RootState) => state.organisation.org
export const selectOrgName = (state: RootState) => state.organisation.org.name
export const selectOrgUuid = (state: RootState) => state.organisation.org.uuid
export const selectIsOrgSetup = (state: RootState) =>
  !!state.organisation.org.uuid
export const selectOrgMembers = (state: RootState) =>
  state.organisation.org.members
export const selectOtherOrgMembers = (state: RootState) => {
  const members = state.organisation.org.members
  const userUuid = store.getState().user.user.uuid as string
  const otherMembers = _.omit(members, userUuid)
  return otherMembers
}
export const selectOrgMembersList = createSelector(
  [selectOrgMembers],
  (members) => {
    return _.values(members)
  },
)
export const selectOtherOrgMembersList = createSelector(
  [selectOtherOrgMembers],
  (otherMembers) => {
    return _.values(otherMembers)
  },
)
export const selectOrgInvites = (state: RootState) => {
  const invites = state.organisation.org.invites
  const modifiedInvites = {}
  if (!!invites) {
    _.forIn(invites, (value, key) => {
      _.set(modifiedInvites, `${key}.tempName`, value)
      _.set(modifiedInvites, `${key}.inviteKey`, key)
    })
    return modifiedInvites
  }
}
export const selectOrgInvitesList = createSelector(
  [selectOrgInvites],
  (invites) => {
    return _.values(invites)
  },
)

export default organisationSlice.reducer
