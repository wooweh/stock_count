import { createListenerMiddleware } from "@reduxjs/toolkit"
import { store } from "../../app/store"
import { generateNotification } from "../core/coreUtils"
import { setCountChecks } from "../count/countSlice"
import { setCountChecksOnDB } from "../count/countSliceRemote"
import {
  deleteCountCheck,
  deleteInvite,
  deleteInvites,
  deleteOrg,
  deleteOrgMember,
  setCountCheck,
  setInvite,
  setOrg,
  setOrgMember,
  setOrgName,
} from "../org/orgSlice"
import {
  createOrgInviteOnDB,
  deleteCountCheckOnDB,
  deleteOrgInviteOnDB,
  deleteOrgInvitesOnDB,
  deleteOrgMemberOnDB,
  deleteOrgOnDB,
  setCountCheckOnDB,
  setOrgMemberOnDB,
  setOrgNameOnDB,
  setOrgOnDB,
} from "../org/orgSliceRemote"
/*





*/
export const orgListenerMiddleware = createListenerMiddleware()
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: setOrg,
  effect: async (action) => {
    const org = action.payload.org
    const updateDB = action.payload.updateDB
    if (updateDB) setOrgOnDB(org)
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: setOrgName,
  effect: async (action) => {
    const name = action.payload
    setOrgNameOnDB(name)
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: deleteOrg,
  effect: async (action) => {
    const orgUuid = action.payload.uuid
    deleteOrgOnDB(orgUuid)
      .then(() => generateNotification("deleteOrg"))
      .catch((error) => console.log(error))
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: setInvite,
  effect: async (action) => {
    const inviteKey = action.payload.inviteKey
    const tempName = action.payload.tempName
    createOrgInviteOnDB(inviteKey, tempName)
      .then(() => generateNotification("createInvite"))
      .catch((error) => console.log(error))
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: deleteInvite,
  effect: async (action) => {
    const orgUuid = store.getState().org.org.uuid
    const isUserAdmin = store.getState().user.user.org?.role === "admin"
    const inviteKey = action.payload.inviteKey
    if (!!orgUuid)
      deleteOrgInviteOnDB(orgUuid, inviteKey)
        .then(() => {
          if (isUserAdmin) generateNotification("deleteInvite")
        })
        .catch((error) => console.log(error))
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: deleteInvites,
  effect: async () => {
    const orgUuid = store.getState().org.org.uuid
    const invites = store.getState().org.org.invites
    if (!!orgUuid && !!invites) {
      deleteOrgInvitesOnDB(invites)
    }
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: setOrgMember,
  effect: async (action) => {
    const orgUuid = action.payload.orgUuid
    const orgMember = action.payload.member
    setOrgMemberOnDB(orgUuid, orgMember)
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: deleteOrgMember,
  effect: async (action) => {
    const userUuid = store.getState().user.user.uuid
    const memberUuid = action.payload.memberUuid
    const orgUuid = action.payload.orgUuid
    const isUserLeaving = userUuid === memberUuid
    deleteOrgMemberOnDB(orgUuid, memberUuid)
      .then(() => {
        if (isUserLeaving) {
          generateNotification("leaveOrg")
        } else {
          generateNotification("deleteOrgMember")
        }
      })
      .catch((error) => console.log(error))
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: setCountCheck,
  effect: async (action) => {
    const check = action.payload.check
    const id = action.payload.id
    setCountCheckOnDB(check, id)
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: setCountChecks,
  effect: async (action) => {
    const checks = action.payload.checks
    const updateDB = action.payload.updateDB
    if (updateDB) setCountChecksOnDB(checks)
  },
})
/*





*/
orgListenerMiddleware.startListening({
  actionCreator: deleteCountCheck,
  effect: async (action) => {
    const id = action.payload.id
    deleteCountCheckOnDB(id)
  },
})
/*





*/
