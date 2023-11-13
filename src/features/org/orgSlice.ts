import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import { UpdateDB, UserOrgRoles } from "../user/userSlice"
/*




*/
export type OrgProps = {
  name?: string
  uuid?: string
  members?: MembersProps
  invites?: InvitesProps
  countChecks?: CountChecksProps
}
export type MemberProps = {
  firstName: string
  lastName: string
  role: UserOrgRoles
  uuid: string
}
export type MembersProps = {
  [key: string]: MemberProps
}
export type MemberStatuses = "notJoined" | "joining" | "isJoined"
export type InvitesProps = { [key: string]: string }
export type InviteProps = { inviteKey: string; tempName: string }
export type CountChecksProps = {
  [key: string]: string
}
export type SetOrgProps = { org: OrgProps } & UpdateDB
export type SetOrgMemberProps = { orgUuid: string; member: MemberProps }
export type SetCountCheckProps = { id: string; check: string }
export type DeleteCountCheckProps = { id: string }
export type DeleteOrgMemberProps = { orgUuid: string; memberUuid: string }
export type DeleteOrgProps = { uuid: string }
export type DeleteInviteProps = { inviteKey: string }

export interface OrgState {
  memberStatus: MemberStatuses
  org: OrgProps
}

const initialState: OrgState = {
  memberStatus: "notJoined",
  org: {},
}

export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    setMemberStatus: (state, action: PayloadAction<MemberStatuses>) => {
      state.memberStatus = action.payload
    },
    setOrg: (state, action: PayloadAction<SetOrgProps>) => {
      state.org = action.payload.org
    },
    deleteOrg: (state, action: PayloadAction<DeleteOrgProps>) => {
      state.org = {}
      state.memberStatus = "notJoined"
    },
    setOrgName: (state, action: PayloadAction<string>) => {
      state.org.name = action.payload
    },
    setOrgMember: (state, action: PayloadAction<SetOrgMemberProps>) => {
      const memberUuid = action.payload.member.uuid
      const member = action.payload.member
      const members = state.org.members
      if (members) members[memberUuid] = member
    },
    deleteOrgMember: (state, action: PayloadAction<DeleteOrgMemberProps>) => {
      const memberUuid = action.payload.memberUuid
      const members = state.org.members
      if (members) delete members[memberUuid]
    },
    setInvite: (state, action: PayloadAction<InviteProps>) => {
      const inviteKey = action.payload.inviteKey
      const tempName = action.payload.tempName
      _.set(state.org, `invites.${inviteKey}`, tempName)
    },
    deleteInvite: (state, action: PayloadAction<DeleteInviteProps>) => {
      const inviteKey = action.payload.inviteKey
      const invites = state.org.invites
      const isInviteKey = invites && inviteKey in invites
      if (isInviteKey) delete invites[inviteKey]
    },
    deleteInvites: (state) => {
      const invites = state.org.invites
      if (invites) delete state.org.invites
    },
    setCountCheck: (state, action: PayloadAction<SetCountCheckProps>) => {
      const id = action.payload.id
      const check = action.payload.check
      _.set(state.org, `countChecks.${id}`, check)
    },
    deleteCountCheck: (state, action: PayloadAction<DeleteCountCheckProps>) => {
      const id = action.payload.id
      const countChecks = state.org.countChecks
      if (countChecks) delete countChecks[id]
    },
  },
})

export const {
  setOrg,
  setOrgName,
  setOrgMember,
  deleteOrgMember,
  setMemberStatus,
  deleteOrg,
  setInvite,
  deleteInvite,
  deleteInvites,
  setCountCheck,
  deleteCountCheck,
} = orgSlice.actions

export const orgSelector = (state: RootState) => state.org

export default orgSlice.reducer
