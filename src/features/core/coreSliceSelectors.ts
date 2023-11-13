import { createSelector } from "@reduxjs/toolkit"
import { coreSelector } from "./coreSlice"
/*




*/
export const selectIsMobile = createSelector(
  [coreSelector],
  (core) => core.isMobile,
)
/*




*/
export const selectIsDarkmode = createSelector(
  [coreSelector],
  (core) => core.isDarkmode,
)
/*




*/
export const selectShowNotification = createSelector(
  [coreSelector],
  (core) => core.showNotification,
)
/*




*/
export const selectNotification = createSelector(
  [coreSelector],
  (core) => core.notificaiton,
)
/*




*/
export const selectSystemStatus = createSelector(
  [coreSelector],
  (core) => core.systemStatus,
)
/*




*/
export const selectIsSystemBooted = createSelector(
  [selectSystemStatus],
  (status) => status === "isBooted",
)
/*




*/
export const selectIsSystemBooting = createSelector(
  [selectSystemStatus],
  (status) => status === "isBooting",
)
/*




*/
export const selectIsSystemActive = createSelector(
  [selectIsSystemBooted, selectIsSystemBooting],
  (isBooted, isBooting) => isBooted || isBooting,
)
/*




*/
