import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { store } from "../../app/store"
import { generateCustomNotification } from "../core/coreUtils"
import { deleteCount } from "../count/countSlice"
import { deleteHistory } from "../history/historySlice"
import { deleteStock } from "../stock/stockSlice"
import {
  UserOrgRoles,
  deleteUserOrgDetails,
  setUserOrgDetails,
} from "../user/userSlice"
import {
  MemberProps,
  MemberStatuses,
  MembersProps,
  OrgProps,
  deleteInvite,
  deleteInvites,
  deleteOrg,
  deleteOrgMember,
  setInvite,
  setMemberStatus,
  setOrg,
  setOrgMember,
  setOrgName,
} from "./orgSlice"
import { getOrgFromDB, getOrgUuidWithInviteKeyFromDB } from "./orgSliceRemote"
import { getInviteKeyValidation } from "./orgUtils"
/*




*/
export function updateMemberStatus(memberStatus: MemberStatuses) {
  store.dispatch(setMemberStatus(memberStatus))
}
/*




*/
export function createOrg(name: string) {
  const orgUuid = uuidv4()
  const memberUuid = store.getState().user.user.uuid as string
  const firstName = store.getState().user.user.name?.first ?? "name"
  const lastName = store.getState().user.user.name?.last ?? "surname"
  const role = "admin"

  const member: MemberProps = { firstName, lastName, role, uuid: memberUuid }
  const members: MembersProps = { [memberUuid]: member }
  const org: OrgProps = { name, uuid: orgUuid, members }

  store.dispatch(setMemberStatus("isJoined"))
  store.dispatch(setUserOrgDetails({ uuid: orgUuid, role }))
  store.dispatch(setOrg({ org, updateDB: true }))
}
/*




*/
export function joinOrg(inviteKey: string) {
  const uuid = store.getState().user.user.uuid as string
  const firstName = store.getState().user.user.name?.first as string
  const lastName = store.getState().user.user.name?.last as string
  const role = "member"
  const member: MemberProps = { uuid, firstName, lastName, role }

  const isInviteKeyValid = getInviteKeyValidation(inviteKey)
  if (isInviteKeyValid) {
    store.dispatch(setMemberStatus("joining"))
    return getOrgUuidWithInviteKeyFromDB(inviteKey)
      .then((uuid: string) => {
        store.dispatch(setUserOrgDetails({ uuid, role }))
        store.dispatch(setOrgMember({ orgUuid: uuid, member }))
        return uuid
      })
      .then((uuid: string) => {
        return getOrgFromDB(uuid)
      })
      .then((org: OrgProps) => {
        store.dispatch(setOrg({ org, updateDB: false }))
        _.delay(() => store.dispatch(setMemberStatus("isJoined")), 1000)
        store.dispatch(deleteInvite({ inviteKey }))
        generateCustomNotification("success", `You have joined ${org.name}`)
        return { isJoined: true }
      })
      .catch((error) => {
        console.log(error)
        generateCustomNotification("error", "Invite key does not exist.")
        return { isJoined: false }
      })
  } else {
    generateCustomNotification("error", "Invite key is invalid.")
    return { isJoined: false }
  }
}
/*




*/
export function leaveOrg() {
  const memberUuid = store.getState().user.user.uuid
  const orgUuid = store.getState().org.org.uuid
  if (!!memberUuid && !!orgUuid) {
    store.dispatch(setMemberStatus("notJoined"))
    store.dispatch(setOrg({ org: {}, updateDB: false }))
    store.dispatch(deleteUserOrgDetails())
    store.dispatch(deleteOrgMember({ orgUuid, memberUuid }))
  }
}
/*




*/
export function removeOrg() {
  const uuid = store.getState().org.org.uuid
  if (!!uuid) {
    store.dispatch(deleteInvites())
    store.dispatch(deleteStock())
    store.dispatch(deleteCount({ updateDB: true }))
    store.dispatch(deleteHistory())
    store.dispatch(deleteUserOrgDetails())
    store.dispatch(deleteOrg({ uuid }))
  }
}
/*




*/
export function updateOrg(org: OrgProps, updateDB: boolean = false) {
  store.dispatch(setOrg({ org, updateDB }))
}
/*




*/
export function updateOrgName(name: string) {
  store.dispatch(setOrgName(name))
}
/*




*/
export function updateOrgMemberRole(uuid: string, role: UserOrgRoles) {
  const orgUuid = store.getState().org.org.uuid
  const members = store.getState().org.org.members
  if (!!orgUuid && !!members) {
    const member = members[uuid]
    store.dispatch(setOrgMember({ orgUuid, member }))
  }
}
/*




*/
export function removeOrgMember(memberUuid: string) {
  const orgUuid = store.getState().org.org.uuid
  if (!!orgUuid) {
    store.dispatch(deleteOrgMember({ orgUuid, memberUuid }))
  }
}
/*




*/
export function createInvite(inviteKey: string, tempName: string) {
  store.dispatch(setInvite({ inviteKey, tempName }))
}
/*




*/
export function removeInvite(inviteKey: string) {
  store.dispatch(deleteInvite({ inviteKey }))
}
/*




*/
