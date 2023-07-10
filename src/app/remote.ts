import { deleteUser, updateEmail } from "firebase/auth"
import { child, get, ref, remove, set } from "firebase/database"
import {
  MemberProps,
  OrgProps,
} from "../features/organisation/organisationSlice"
import { UserOrgRoles, UserProps } from "../features/user/userSlice"
import { auth, dbReal } from "../remote_config"
import { store } from "./store"
/*







*/
export async function setUserEmailOnAuth(email: string) {
  const authUser = auth.currentUser
  if (!!authUser) {
    updateEmail(authUser, email).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteUserOnAuth() {
  const authUser = auth.currentUser
  if (!!authUser) {
    deleteUser(authUser).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function getUserFromDB() {
  const authUser = auth.currentUser
  const userUuid = authUser?.uid
  return get(child(ref(dbReal), `users/${userUuid}`))
    .then((snapshot) => {
      const user = snapshot.val()
      return user
    })
    .catch((error) => {
      console.error(error)
    })
}
/*





*/
export async function getOrgFromDB(orgUuid: string) {
  return get(child(ref(dbReal), `organisations/${orgUuid}`))
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
  return get(child(ref(dbReal), `invites/${inviteKey}`))
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
export async function createInviteOnDB(inviteKey: string, tempName: string) {
  const orgUuid = store.getState().organisation.org.uuid
  if (!!orgUuid) {
    set(ref(dbReal, `invites/${inviteKey}`), orgUuid).catch((error) =>
      console.log(error),
    )
    set(
      ref(dbReal, `organisations/${orgUuid}/invites/${inviteKey}`),
      tempName,
    ).catch((error) => console.log(error))
  }
}
/*





*/
export async function deleteInviteOnDB(orgUuid: string, inviteKey: string) {
  remove(ref(dbReal, `invites/${inviteKey}`)).catch((error) =>
    console.log(error),
  )
  remove(ref(dbReal, `organisations/${orgUuid}/invites/${inviteKey}`)).catch(
    (error) => console.log(error),
  )
}
/*





*/
export async function setNewUserOnDB() {
  const userUuid = auth.currentUser?.uid
  const userEmail = auth.currentUser?.email as string
  const user: UserProps = { uuid: userUuid, email: userEmail }

  if (!!userUuid) {
    set(ref(dbReal, `users/${userUuid}`), user).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserNameOnDB(name: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, `users/${userUuid}/name`), name).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserSurnameOnDB(surname: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, `users/${userUuid}/surname`), surname).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserEmailOnDB(email: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, `users/${userUuid}/email`), email).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserOrgUuidOnDB(uuid: string | undefined) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, `users/${userUuid}/orgUuid`), uuid).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserOrgRoleOnDB(userUuid: string, role: UserOrgRoles) {
  if (!!userUuid) {
    set(ref(dbReal, `users/${userUuid}/orgRole`), role).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteUserOnDB() {
  const userUuid = auth.currentUser?.uid
  if (!!userUuid) {
    remove(ref(dbReal, `users/${userUuid}`)).catch((error) =>
      console.log(error),
    )
  }
}
/*





*/
export async function deleteUserOrgDetailsOnDB(userUuid: string) {
  remove(ref(dbReal, `users/${userUuid}/orgRole`)).catch((error) =>
    console.log(error),
  )
  remove(ref(dbReal, `users/${userUuid}/orgUuid`)).catch((error) =>
    console.log(error),
  )
}
/*





*/
export async function setNewOrgOnDB(payload: OrgProps) {
  set(ref(dbReal, `organisations/${payload.uuid}`), { ...payload }).catch(
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
    remove(ref(dbReal, `organisations/${orgUuid}`)).catch((error) => {
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
      ref(dbReal, `organisations/${orgUuid}/members/${userUuid}`),
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
    set(
      ref(dbReal, `organisations/${orgUuid}/members/${userUuid}/name`),
      name,
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setOrgMemberSurnameOnDB(surname: string) {
  const userUuid = store.getState().user.user.uuid
  const orgUuid = store.getState().user.user.orgUuid
  if (!!orgUuid && !!userUuid) {
    set(
      ref(dbReal, `organisations/${orgUuid}/members/${userUuid}/surname`),
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
      ref(dbReal, `organisations/${orgUuid}/members/${memberUuid}/role`),
      role,
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteOrgMemberOnDB(memberUuid: string) {
  const orgUuid = store.getState().user.user.orgUuid
  if (!!orgUuid) {
    remove(ref(dbReal, `organisations/${orgUuid}/members/${memberUuid}`)).catch(
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
    set(ref(dbReal, `organisations/${orgUuid}/name`), name).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
