import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState, store } from "../../app/store"
import { UserOrgRoles } from "../user/userSlice"

export type OrgProps = {
  name?: string
  uuid?: string
  members?: MembersProps
  invites?: InvitesProps
}
export type MemberRoleProps = {
  uuid: string
  role: UserOrgRoles
}
export type MemberNameProps = {
  uuid: string
  name: string
}
export type MemberSurnameProps = {
  uuid: string
  surname: string
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
    deleteOrg: (state) => {
      state.org = {}
      state.memberStatus = "notJoined"
    },
    leaveOrg: (state) => {
      state.org = {}
      state.memberStatus = "notJoined"
    },
    setOrgName: (state, action: PayloadAction<string>) => {
      state.org.name = action.payload
    },
    setOrgMemberName: (state, action: PayloadAction<MemberNameProps>) => {
      const memberUuid = action.payload.uuid
      const name = action.payload.name
      if (state.org.members) {
        state.org.members[memberUuid].name = name
      }
    },
    setOrgMemberSurname: (state, action: PayloadAction<MemberSurnameProps>) => {
      const memberUuid = action.payload.uuid
      const surname = action.payload.surname
      if (state.org.members) {
        state.org.members[memberUuid].surname = surname
      }
    },
    setOrgMemberRole: (state, action: PayloadAction<MemberRoleProps>) => {
      const memberUuid = action.payload.uuid
      const memberRole = action.payload.role
      if (state.org.members) {
        state.org.members[memberUuid].role = memberRole
      }
    },
    deleteOrgMember: (state, action: PayloadAction<string>) => {
      const memberUuid = action.payload
      const members = state.org.members
      if (members && memberUuid in members) {
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
  setOrgMemberName,
  setOrgMemberSurname,
  setOrgMemberRole,
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
export const selectOrgName = (state: RootState) => state.organisation.org.name
export const selectOrgUuid = (state: RootState) => state.organisation.org.uuid
export const selectOrgMembers = (state: RootState) => {
  const members = state.organisation.org.members
  const userUuid = store.getState().user.user.uuid
  const modifiedMembers = {}
  if (!!members) {
    _.forIn(members, (value, key) => {
      if (key !== userUuid) {
        _.set(modifiedMembers, key, value)
      }
    })
    return _.values(modifiedMembers)
  }
}
export const selectOrgInvites = (state: RootState) => {
  const invites = state.organisation.org.invites
  const modifiedInvites = {}
  if (!!invites) {
    _.forIn(invites, (value, key) => {
      _.set(modifiedInvites, `${key}.tempName`, value)
      _.set(modifiedInvites, `${key}.inviteKey`, key)
    })
    return _.values(modifiedInvites)
  }
}
export default organisationSlice.reducer
