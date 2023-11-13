import { createSelector } from "@reduxjs/toolkit"
import _ from "lodash"
import { selectUserUuidString } from "../user/userSliceSelectors"
import { CountChecksProps, InvitesProps, orgSelector } from "./orgSlice"
/*




*/
export const selectIsJoining = createSelector(
  [orgSelector],
  (org) => org.memberStatus === "joining",
)
/*




*/
export const selectOrgName = createSelector(
  [orgSelector],
  (org) => org.org.name,
)
/*




*/
export const selectOrgUuid = createSelector(
  [orgSelector],
  (org) => org.org.uuid,
)
/*




*/
export const selectIsOrgSetup = createSelector(
  [orgSelector],
  (org) => !!org.org.uuid,
)
/*




*/
export const selectOrgCountChecks = createSelector(
  [orgSelector],
  (org) => org.org.countChecks,
)
/*




*/
export const selectOrgCountChecksList = createSelector(
  [selectOrgCountChecks],
  (checks) => getOrgCountChecksList(checks),
)

type OrgCountCheckProps = {
  check: string
  id: string
}
function getOrgCountChecksList(checks: CountChecksProps | undefined) {
  const checkList: OrgCountCheckProps[] = []
  !!checks &&
    _.forIn(checks, (value, key) => checkList.push({ check: value, id: key }))
  return checkList
}
/*




*/
export const selectOrgMembers = createSelector(
  [orgSelector],
  (org) => org.org.members,
)
/*




*/
export const selectOtherOrgMembers = createSelector(
  [selectOrgMembers, selectUserUuidString],
  (members, userUuid) => _.omit(members, userUuid),
)
/*
        
        
        
        
*/
export const selectOtherOrgMembersList = createSelector(
  [selectOtherOrgMembers],
  (members) => _.values(members),
)
/*
                
                
                
                
*/
export const selectOrgInvites = createSelector([orgSelector], (org) =>
  getOrgInvites(org.org.invites),
)

function getOrgInvites(invites: InvitesProps | undefined) {
  const modifiedInvites: InvitesProps = {}
  !!invites &&
    _.forIn(invites, (value, key) => {
      _.set(modifiedInvites, `${key}.tempName`, value)
      _.set(modifiedInvites, `${key}.inviteKey`, key)
    })
  return modifiedInvites
}
/*
                
                
                
                
*/
export const selectOrgInvitesList = createSelector(
  [selectOrgInvites],
  (invites) => _.values(invites) ?? [],
)
/*
                    
                    
                    
                    
*/
