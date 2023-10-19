import { v4 as uuidv4 } from "uuid"
import { store } from "../../app/store"
import { deleteCount } from "../count/countSlice"
import { deleteHistory } from "../history/historySlice"
import { deleteStock } from "../stock/stockSlice"
import {
  UserOrgRoles,
  deleteUserOrgDetails,
  setUserOrgDetails,
} from "../user/userSlice"
import {
  getOrgFromDB,
  getOrgUuidWithInviteKeyFromDB,
} from "./organisationRemote"
import {
  MemberProps,
  MemberStatuses,
  MembersProps,
  OrgProps,
  deleteInvite,
  deleteInvites,
  deleteOrg,
  deleteOrgMember,
  setMemberStatus,
  setOrg,
  setOrgMember,
} from "./organisationSlice"
/*




*/
export function updateMemberStatus(memberStatus: MemberStatuses) {
  store.dispatch(setMemberStatus(memberStatus))
}
/*




*/
export function createOrg(name: string) {
  const uuid = uuidv4()
  const memberUuid = store.getState().user.user.uuid as string
  const firstName = store.getState().user.user.name?.first ?? "name"
  const lastName = store.getState().user.user.name?.last ?? "surname"
  const role = "admin"

  const member: MemberProps = { firstName, lastName, role, uuid }
  const members: MembersProps = { [memberUuid]: member }
  const org: OrgProps = { name, uuid, members }

  store.dispatch(setMemberStatus("isJoined"))
  store.dispatch(setUserOrgDetails({ uuid, role }))
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
  store.dispatch(setMemberStatus("joining"))
  getOrgUuidWithInviteKeyFromDB(inviteKey)
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
      store.dispatch(setMemberStatus("isJoined"))
    })
    .then(() => {
      store.dispatch(deleteInvite(inviteKey))
    })
    .catch((error) => {
      console.log(error)
    })
}
/*




*/
export function leaveOrg() {
  const memberUuid = store.getState().user.user.uuid
  const orgUuid = store.getState().organisation.org.uuid
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
  const uuid = store.getState().organisation.org.uuid
  if (!!uuid) {
    store.dispatch(deleteInvites())
    store.dispatch(deleteStock())
    store.dispatch(deleteCount())
    store.dispatch(deleteHistory())
    store.dispatch(deleteUserOrgDetails())
    store.dispatch(deleteOrg({ uuid }))
  }
}
/*




*/
export function updateOrgName() {}
/*




*/
export function createOrgMember() {}
/*




*/
export function updateOrgMemberName(firstName: string, lastName: string) {}
/*




*/
export function updateOrgMemberRole(role: UserOrgRoles) {}
/*




*/
export function removeOrgMember() {}
/*




*/
export function sendInvite() {}
/*




*/
export function removeInvite() {}
/*




*/
export function removeInvites() {}
/*




*/
export function updateCountCheck() {}
/*




*/
export function removeCountCheck() {}
/*




*/
