import { child, get, ref, remove, set } from "firebase/database"
import _ from "lodash"
import { store } from "../../app/store"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import { InvitesProps, MemberProps, OrgProps } from "./organisationSlice"
/*





*/
export async function getOrgFromDB(orgUuid: string) {
  return get(child(ref(dbReal), getDBPath.org(orgUuid).org))
    .then((snapshot) => {
      const org = snapshot.val()
      return org
    })
    .catch((error) => {
      console.error(error)
    })
}
/*





*/
export async function getOrgUuidWithInviteKeyFromDB(inviteKey: string) {
  return get(child(ref(dbReal), getDBPath.invite(inviteKey).invite))
    .then((snapshot) => {
      const uuid = snapshot.val()
      return uuid
    })
    .catch((error) => {
      console.error(error)
    })
}
/*





*/
export async function createOrgInviteOnDB(inviteKey: string, tempName: string) {
  const orgUuid = store.getState().organisation.org.uuid
  if (!!orgUuid) {
    set(ref(dbReal, getDBPath.invite(inviteKey).invite), orgUuid).catch(
      (error) => console.log(error),
    )
    set(
      ref(dbReal, getDBPath.org(orgUuid).invite(inviteKey).invite),
      tempName,
    ).catch((error) => console.log(error))
  }
}
/*





*/
export async function deleteOrgInviteOnDB(orgUuid: string, inviteKey: string) {
  remove(ref(dbReal, getDBPath.invite(inviteKey).invite)).catch((error) =>
    console.log(error),
  )
  remove(ref(dbReal, getDBPath.org(orgUuid).invite(inviteKey).invite)).catch(
    (error) => console.log(error),
  )
}
/*





*/
export async function deleteAllOrgInvitesOnDB(invites: InvitesProps) {
  _.forEach(invites, (value, key) =>
    remove(ref(dbReal, getDBPath.invite(key).invite)).catch((error) =>
      console.log(error),
    ),
  )
}
/*





*/
export async function setNewOrgOnDB(payload: OrgProps) {
  const orgUuid = payload.uuid as string
  set(ref(dbReal, getDBPath.org(orgUuid).org), { ...payload }).catch(
    (error) => {
      console.log(error)
    },
  )
}
/*





*/
export async function deleteOrgOnDB(orgUuid: string) {
  remove(ref(dbReal, getDBPath.org(orgUuid).org)).catch((error) => {
    console.log(error)
  })
}
/*





*/
export async function setOrgMemberOnDB(
  orgUuid: string,
  orgMember: MemberProps,
) {
  const memberUuid = orgMember.uuid

  set(
    ref(dbReal, getDBPath.org(orgUuid).member(memberUuid).member),
    orgMember,
  ).catch((error) => {
    console.log(error)
  })
}
/*





*/
export async function deleteOrgMemberOnDB(orgUuid: string, memberUuid: string) {
  if (!!orgUuid) {
    remove(ref(dbReal, getDBPath.org(orgUuid).member(memberUuid).member)).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setOrgNameOnDB(name: string) {
  const orgUuid = store.getState().organisation.org.uuid
  if (!!orgUuid) {
    set(ref(dbReal, getDBPath.org(orgUuid).name), name).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
