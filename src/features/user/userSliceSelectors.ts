import { createSelector } from "@reduxjs/toolkit"
import { userSelector } from "./userSlice"

/*




*/
export const selectIsSignedIn = createSelector(
  [userSelector],
  (user) => user.isSignedIn,
)
/*




*/
export const selectUser = createSelector([userSelector], (user) => user.user)
/*




*/
export const selectUserName = createSelector([selectUser], (user) => user.name)
/*




*/
export const selectUserEmail = createSelector([selectUser], (user) =>
  !!user ? user.email : undefined,
)
/*




*/
export const selectUserUuid = createSelector([selectUser], (user) =>
  !!user ? user.uuid : undefined,
)
/*




*/
export const selectUserUuidString = createSelector(
  [selectUserUuid],
  (uuid) => uuid as string,
)
/*




*/
export const selectUserOrgDetails = createSelector([selectUser], (user) =>
  !!user ? user.org : undefined,
)
/*




*/
export const selectUserOrgUuid = createSelector([selectUser], (user) =>
  !!user ? user.org?.uuid : undefined,
)
/*




*/
export const selectPasswordChangeStatus = createSelector(
  [userSelector],
  (user) => user.passwordChangeStatus,
)
/*
    
    
    
    
*/
export const selectIsPasswordChangeFailed = createSelector(
  [selectPasswordChangeStatus],
  (status) => status === "isFailed",
)
/*
   
   
   
   
*/
export const selectIsPasswordChangeSuccess = createSelector(
  [selectPasswordChangeStatus],
  (status) => status === "isSuccess",
)
/*
  
  
  
  
*/
export const selectIsPasswordChangePending = createSelector(
  [selectPasswordChangeStatus],
  (status) => status === "isPending",
)
/*
 
 
 
 
 */
export const selectEmailChangeStatus = createSelector(
  [userSelector],
  (user) => user.emailChangeStatus,
)
/*
    
    
    
    
*/
export const selectIsEmailChangeFailed = createSelector(
  [selectEmailChangeStatus],
  (status) => status === "isFailed",
)
/*
   
   
   
   
*/
export const selectIsEmailChangeSuccess = createSelector(
  [selectEmailChangeStatus],
  (status) => status === "isSuccess",
)
/*
  
  
  
  
*/
export const selectIsEmailChangePending = createSelector(
  [selectEmailChangeStatus],
  (status) => status === "isPending",
)
/*
 
 
 
 
 */
export const selectIsUserAdmin = createSelector(
  [userSelector],
  (user) => user.user.org?.role === "admin",
)
/*




*/
export const selectIsProfileComplete = createSelector(
  [userSelector],
  (user) => user.user.name?.first && user.user.name.last,
)
/*




*/
