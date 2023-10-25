import { RootState, store } from "../../app/store"
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { UpdateDB, UserOrgRoles } from "../user/userSlice"

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

      if (members) {
        members[memberUuid] = member
      }
    },
    deleteOrgMember: (state, action: PayloadAction<DeleteOrgMemberProps>) => {
      const memberUuid = action.payload.memberUuid
      const members = state.org.members

      if (members) {
        delete members[memberUuid]
      }
    },
    setInvite: (state, action: PayloadAction<InviteProps>) => {
      const inviteKey = action.payload.inviteKey
      const tempName = action.payload.tempName
      _.set(state.org, `invites.${inviteKey}`, tempName)
    },
    deleteInvite: (state, action: PayloadAction<DeleteInviteProps>) => {
      const inviteKey = action.payload.inviteKey
      const invites = state.org.invites
      if (invites && inviteKey in invites) {
        delete invites[inviteKey]
      }
    },
    deleteInvites: (state) => {
      const invites = state.org.invites
      if (invites) {
        delete state.org.invites
      }
    },
    setCountCheck: (state, action: PayloadAction<SetCountCheckProps>) => {
      const id = action.payload.id
      const check = action.payload.check
      _.set(state.org, `countChecks.${id}`, check)
    },
    deleteCountCheck: (state, action: PayloadAction<DeleteCountCheckProps>) => {
      const id = action.payload.id
      const countChecks = state.org.countChecks
      if (countChecks) {
        delete countChecks[id]
      }
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

export const selectIsJoining = (state: RootState) => {
  return state.org.memberStatus === "joining"
}
export const selectIsJoined = (state: RootState) => {
  return state.org.memberStatus === "isJoined"
}
export const selectOrg = (state: RootState) => state.org.org
export const selectOrgName = (state: RootState) => state.org.org.name
export const selectOrgUuid = (state: RootState) => state.org.org.uuid
export const selectIsOrgSetup = (state: RootState) => !!state.org.org.uuid
export const selectOrgCountChecks = (state: RootState) =>
  state.org.org.countChecks
export const selectOrgCountChecksList = createSelector(
  [selectOrgCountChecks],
  (checks) => {
    const checkList: any = []
    _.forIn(checks, (value, key) => {
      checkList.push({ check: value, id: key })
    })
    return checkList
  },
)
export const selectOrgMembers = (state: RootState) => {
  const members = state.org.org.members
  if (!!members) {
    return members
  } else {
    return {}
  }
}
export const selectUserOrgMember = createSelector(
  [selectOrgMembers],
  (members) => {
    const userUuid = store.getState().user.user.uuid as string
    const userMember = _.pick(members, userUuid)
    return userMember
  },
)
export const selectOtherOrgMembers = createSelector(
  [selectOrgMembers],
  (members) => {
    const userUuid = store.getState().user.user.uuid as string
    const otherMembers = _.omit(members, userUuid)
    return otherMembers
  },
)
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
  const invites = state.org.org.invites
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

export default orgSlice.reducer