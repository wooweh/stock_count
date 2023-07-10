import { createListenerMiddleware } from "@reduxjs/toolkit"
import { signOut as signOutAuth } from "firebase/auth"
import { generateNotification } from "../common/utils"
import { resetSystem } from "../features/core/coreSlice"
import {
  OrgProps,
  createInvite,
  createOrg,
  deleteInvite,
  deleteOrg,
  deleteOrgMember,
  joinOrg,
  leaveOrg,
  setMemberStatus,
  setOrg,
  setOrgMemberName,
  setOrgMemberRole,
  setOrgMemberSurname,
  setOrgName,
} from "../features/organisation/organisationSlice"
import {
  deleteUser,
  deleteUserOrgDetails,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgRole,
  setUserOrgUuid,
  setUserSurname,
  signIn,
  signOut,
} from "../features/user/userSlice"
import { auth } from "../remote_config"
import { syncUserDetails } from "./helpers"
import {
  createInviteOnDB,
  deleteInviteOnDB,
  deleteOrgMemberOnDB,
  deleteOrgOnDB,
  deleteUserOnAuth,
  deleteUserOnDB,
  deleteUserOrgDetailsOnDB,
  getOrgFromDB,
  getOrgUuidWithInviteKeyFromDB,
  setNewOrgMemberOnDB,
  setNewOrgOnDB,
  setOrgMemberNameOnDB,
  setOrgMemberRoleOnDB,
  setOrgMemberSurnameOnDB,
  setOrgNameOnDB,
  setUserEmailOnAuth,
  setUserEmailOnDB,
  setUserNameOnDB,
  setUserOrgRoleOnDB,
  setUserOrgUuidOnDB,
  setUserSurnameOnDB,
} from "./remote"
import { store } from "./store"
/*





*/
export const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
  actionCreator: resetSystem,
  effect: async () => {
    console.log("Reset user in userSlice")
    console.log("Reset org in orgSlice")
    store.dispatch(setMemberStatus("notJoined"))
    store.dispatch(setUser({}))
    store.dispatch(setOrg({}))
    // TODO: Stock
    // TODO: History
    // TODO: Count
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: signIn,
  effect: async () => {
    syncUserDetails()
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: signOut,
  effect: async () => {
    signOutAuth(auth)
    store.dispatch(resetSystem())
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserEmail,
  effect: async (action) => {
    const email = action.payload
    setUserEmailOnDB(email)
    setUserEmailOnAuth(email)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserName,
  effect: async (action) => {
    const name = action.payload
    setUserNameOnDB(name)

    const orgUuid = store.getState().organisation.org.uuid
    const userUuid = store.getState().user.user.uuid
    if (!!orgUuid && !!userUuid)
      store.dispatch(setOrgMemberName({ uuid: userUuid, name: name }))
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserSurname,
  effect: async (action) => {
    const surname = action.payload
    setUserSurnameOnDB(surname)

    const orgUuid = store.getState().organisation.org.uuid
    const userUuid = store.getState().user.user.uuid
    if (!!orgUuid && !!userUuid)
      store.dispatch(setOrgMemberSurname({ uuid: userUuid, surname: surname }))
  },
})
/*
  
  
  
  
  
  
  
  
  */
listenerMiddleware.startListening({
  actionCreator: setUserOrgUuid,
  effect: async (action) => {
    const orgUuid = action.payload
    setUserOrgUuidOnDB(orgUuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserOrgRole,
  effect: async (action) => {
    const userUuid = auth.currentUser?.uid
    const orgRole = action.payload
    if (!!userUuid) setUserOrgRoleOnDB(userUuid, orgRole)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUserOrgDetails,
  effect: async () => {
    const userUuid = auth.currentUser?.uid
    if (!!userUuid) deleteUserOrgDetailsOnDB(userUuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUser,
  effect: async () => {
    const userUuid = auth.currentUser?.uid
    if (!!userUuid) {
      deleteOrgMemberOnDB(userUuid)
        .then(() => deleteUserOnDB())
        .then(() => deleteUserOnAuth())
        .catch((error) => console.log(error))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: createOrg,
  effect: async (action) => {
    const payload = action.payload
    setNewOrgOnDB(payload)

    const orgUuid = action.payload.uuid
    if (!!orgUuid) {
      store.dispatch(setUserOrgUuid(orgUuid))
      store.dispatch(setUserOrgRole("admin"))
      store.dispatch(setMemberStatus("isJoined"))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: joinOrg,
  effect: async (action) => {
    const inviteKey = action.payload
    getOrgUuidWithInviteKeyFromDB(inviteKey)
      .then((orgUuid: string) => {
        deleteInviteOnDB(orgUuid, inviteKey)
        setNewOrgMemberOnDB(orgUuid)
        return orgUuid
      })
      .then((orgUuid: string) => getOrgFromDB(orgUuid))
      .then((org: OrgProps) => {
        store.dispatch(setOrg(org))
        store.dispatch(setUserOrgUuid(org.uuid as string))
        store.dispatch(setUserOrgRole("member"))
        store.dispatch(setMemberStatus("isJoined"))
      })
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgName,
  effect: async (action) => {
    const orgUuid = store.getState().organisation.org.uuid
    if (!!orgUuid) {
      const name = action.payload
      setOrgNameOnDB(name)
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: leaveOrg,
  effect: async () => {
    const memberUuid = auth.currentUser?.uid
    if (!!memberUuid) {
      deleteOrgMemberOnDB(memberUuid)
        .then(() => store.dispatch(deleteUserOrgDetails()))
        .catch((error) => console.log(error))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteOrg,
  effect: async () => {
    const orgUuid = store.getState().user.user.orgUuid
    if (!!orgUuid) {
      deleteOrgOnDB(orgUuid).then(() => generateNotification("deleteOrg"))
      store.dispatch(deleteUserOrgDetails())
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: createInvite,
  effect: async (action) => {
    const inviteKey = action.payload.inviteKey
    const tempName = action.payload.tempName
    createInviteOnDB(inviteKey, tempName).then(() =>
      generateNotification("createInvite"),
    )
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteInvite,
  effect: async (action) => {
    const orgUuid = store.getState().organisation.org.uuid
    const inviteKey = action.payload
    if (!!orgUuid)
      deleteInviteOnDB(orgUuid, inviteKey).then(() =>
        generateNotification("deleteInvite"),
      )
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMemberName,
  effect: async (action) => {
    const name = action.payload.name
    setOrgMemberNameOnDB(name)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMemberSurname,
  effect: async (action) => {
    const surname = action.payload.surname
    setOrgMemberSurnameOnDB(surname)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMemberRole,
  effect: async (action) => {
    const role = action.payload.role
    const memberUuid = action.payload.uuid
    if (!!memberUuid) {
      setOrgMemberRoleOnDB(memberUuid, role).then(() =>
        setUserOrgRoleOnDB(memberUuid, role),
      )
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteOrgMember,
  effect: async (action) => {
    const memberUuid = action.payload
    if (!!memberUuid) {
      deleteOrgMemberOnDB(memberUuid)
        .then(() => deleteUserOrgDetailsOnDB(memberUuid))
        .then(() => generateNotification("deleteOrgMember"))
    }
  },
})
/*





*/
