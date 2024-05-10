import {
  off,
  onChildChanged,
  onChildRemoved,
  onValue,
  ref,
} from "firebase/database"
import _ from "lodash"
import { useEffect } from "react"
import { useAppSelector } from "../../app/hooks"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  selectCountersUuidList,
  selectIsManagingCount,
  selectIsUserCountResultsEmpty,
  selectIsUserCounter,
  selectIsUserOrganiser,
} from "../count/countSliceSelectors"
import { selectOrgUuid } from "../org/orgSliceSelectors"
import { updateMemberStatus } from "../org/orgSliceUtils"
import {
  selectUserOrgUuid,
  selectUserUuid,
  selectUserUuidString,
} from "../user/userSliceSelectors"
import {
  selectIsSystemActive,
  selectIsSystemBooting,
} from "./coreSliceSelectors"
import { setSystemIsBooted } from "./coreSliceUtils"
import {
  handleDBCountChecksOnValue,
  handleDBCountCommentsOnValue,
  handleDBCountMembersOnValue,
  handleDBCountMetadataOnValue,
  handleDBCountResultsOnChildChanged,
  handleDBCountResultsOnChildRemoved,
  handleDBHistoryOnValue,
  handleDBOrgOnValue,
  handleDBStockOnValue,
  handleDBUserOnValue,
} from "./dbListenersUtils"
/*




*/
export function DBListeners() {
  return (
    <>
      <UserDBListener />
      <OrgDBListener />
      <StockDBListener />
      <CountDBListener />
      <HistoryDBListener />
    </>
  )
}
/*




*/
export function UserDBListener() {
  const isSystemBooting = useAppSelector(selectIsSystemBooting)
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const userUuid = useAppSelector(selectUserUuid)
  const userOrgUuid = useAppSelector(selectUserOrgUuid)
  const orgUuid = useAppSelector(selectOrgUuid)

  const isSafeToBoot =
    isSystemBooting && ((userOrgUuid && orgUuid) || !userOrgUuid)

  useEffect(() => {
    if (isSafeToBoot) setSystemIsBooted()
  }, [isSafeToBoot])

  const isSafeToSync = !!userUuid && isSystemActive

  useEffect(() => {
    if (isSafeToSync) {
      const dbUserRef = ref(dbReal, getDBPath.user(userUuid).user)
      onValue(dbUserRef, handleDBUserOnValue)
    }

    return () => {
      if (!!userUuid) off(ref(dbReal, getDBPath.user(userUuid).user))
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
export function OrgDBListener() {
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const userUuid = useAppSelector(selectUserUuid)
  const userOrgUuid = useAppSelector(selectUserOrgUuid)
  const orgUuid = useAppSelector(selectOrgUuid)

  const isSafeToSync = !!userUuid && !!userOrgUuid && isSystemActive

  useEffect(() => {
    if (isSafeToSync) {
      if (orgUuid) updateMemberStatus("isJoined")
      const dbOrgRef = ref(dbReal, getDBPath.org(userOrgUuid).org)
      onValue(dbOrgRef, (snapshot) =>
        handleDBOrgOnValue(snapshot, userUuid, userOrgUuid),
      )
    }

    return () => {
      if (!!userOrgUuid) off(ref(dbReal, getDBPath.org(userOrgUuid).org))
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
export function StockDBListener() {
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const userUuid = useAppSelector(selectUserUuid)
  const orgUuid = useAppSelector(selectUserOrgUuid)

  const isSafeToSync = !!userUuid && !!orgUuid && isSystemActive

  useEffect(() => {
    if (isSafeToSync) {
      const dbStockRef = ref(dbReal, getDBPath.stock(orgUuid).stock)
      onValue(dbStockRef, handleDBStockOnValue)
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.stock(orgUuid).stock))
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
export function CountDBListener() {
  const isUserCountResultsEmpty = useAppSelector(selectIsUserCountResultsEmpty)
  const userUuid = useAppSelector(selectUserUuidString)
  const orgUuid = useAppSelector(selectUserOrgUuid)
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const counterUuids = useAppSelector(selectCountersUuidList)
  const isCounter = useAppSelector(selectIsUserCounter)
  const isManaging = useAppSelector(selectIsManagingCount)

  const isSafeToSyncCountMetaData = !!userUuid && !!orgUuid && isSystemActive
  const isSafeToSyncCountData =
    isSafeToSyncCountMetaData && !isManaging && (isCounter || isOrganiser)

  useEffect(() => {
    if (isSafeToSyncCountMetaData) {
      const dbCountMetadataRef = ref(dbReal, getDBPath.count(orgUuid).metadata)
      onValue(dbCountMetadataRef, (snapshot) =>
        handleDBCountMetadataOnValue(snapshot, userUuid, isOrganiser),
      )
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).metadata))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      const dbCountChecksRef = ref(dbReal, getDBPath.count(orgUuid).checks)
      onValue(dbCountChecksRef, handleDBCountChecksOnValue)
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).checks))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      const dbCountCommentsRef = ref(dbReal, getDBPath.count(orgUuid).comments)
      onValue(dbCountCommentsRef, handleDBCountCommentsOnValue)
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).comments))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      const dbCountMembersRef = ref(dbReal, getDBPath.count(orgUuid).members)
      onValue(dbCountMembersRef, handleDBCountMembersOnValue)
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).members))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      _.forEach(counterUuids, (memberUuid) => {
        if (userUuid !== memberUuid || isUserCountResultsEmpty) {
          const dbCountResultsRef = ref(
            dbReal,
            getDBPath.count(orgUuid).memberResults(memberUuid).results,
          )
          onChildChanged(dbCountResultsRef, (snapshot) => {
            handleDBCountResultsOnChildChanged(snapshot, memberUuid)
          })
          onChildRemoved(dbCountResultsRef, (snapshot) => {
            handleDBCountResultsOnChildRemoved(snapshot, memberUuid)
          })
        }
      })
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).results))
    }
  }, [isSafeToSyncCountData])

  return undefined
}
/*




*/
export function HistoryDBListener() {
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const userUuid = useAppSelector(selectUserUuid)
  const orgUuid = useAppSelector(selectUserOrgUuid)

  const isSafeToSync = !!userUuid && !!orgUuid && isSystemActive

  useEffect(() => {
    if (isSafeToSync) {
      const dbHistoryRef = ref(dbReal, getDBPath.history(orgUuid).history)
      onValue(dbHistoryRef, handleDBHistoryOnValue)
    }

    return () => {
      if (!!orgUuid) off(ref(dbReal, getDBPath.history(orgUuid).history))
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
