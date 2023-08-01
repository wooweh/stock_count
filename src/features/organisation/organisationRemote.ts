import { child, get, ref, remove, set } from "firebase/database"
import { dbReal } from "../../remote"
import { store } from "../../app/store"
import {
  InvitesProps,
  MemberProps,
  OrgProps,
} from "./organisationSlice"
import { UserOrgRoles } from "../user/userSlice"
import { getDBPath } from "../../remote/dbPaths"
import _ from "lodash"
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
  return get(child(ref(dbReal), getDBPath.invite(inviteKey)))
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
    set(ref(dbReal, getDBPath.invite(inviteKey)), orgUuid).catch((error) =>
      console.log(error),
    )
    set(ref(dbReal, getDBPath.org(orgUuid).invite(inviteKey)), tempName).catch(
      (error) => console.log(error),
    )
  }
}
/*





*/
export async function deleteOrgInviteOnDB(orgUuid: string, inviteKey: string) {
  remove(ref(dbReal, getDBPath.invite(inviteKey))).catch((error) =>
    console.log(error),
  )
  remove(ref(dbReal, getDBPath.org(orgUuid).invite(inviteKey))).catch((error) =>
    console.log(error),
  )
}
/*





*/
export async function deleteAllOrgInvitesOnDB(invites: InvitesProps) {
  _.forEach(invites, (value, key) =>
    remove(ref(dbReal, getDBPath.invite(key))).catch((error) =>
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
export async function deleteOrgOnDB(uuid: string) {
  const orgUuid = uuid
  if (!!orgUuid) {
    remove(ref(dbReal, getDBPath.org(orgUuid).org)).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setNewOrgMemberOnDB(orgUuid: string) {
  const userUuid = store.getState().user.user.uuid
  const userName = store.getState().user.user.name as string
  const userSurname = store.getState().user.user.surname as string
  const newMember: MemberProps = {
    name: userName,
    surname: userSurname,
    role: "member",
    uuid: userUuid as string,
  }
  if (!!orgUuid && !!userUuid) {
    set(
      ref(dbReal, getDBPath.org(orgUuid).member(userUuid).member),
      newMember,
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setOrgMemberNameOnDB(name: string) {
  const userUuid = store.getState().user.user.uuid
  const orgUuid = store.getState().user.user.orgUuid
  if (!!orgUuid && !!userUuid) {
    set(ref(dbReal, getDBPath.org(orgUuid).member(userUuid).name), name).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setOrgMemberSurnameOnDB(surname: string) {
  const userUuid = store.getState().user.user.uuid
  const orgUuid = store.getState().user.user.orgUuid
  if (!!orgUuid && !!userUuid) {
    set(
      ref(dbReal, getDBPath.org(orgUuid).member(userUuid).surname),
      surname,
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setOrgMemberRoleOnDB(
  memberUuid: string,
  role: UserOrgRoles,
) {
  const orgUuid = store.getState().user.user.orgUuid
  if (!!orgUuid) {
    set(
      ref(dbReal, getDBPath.org(orgUuid).member(memberUuid).role),
      role,
    ).catch((error) => {
      console.log(error)
    })
  }
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
