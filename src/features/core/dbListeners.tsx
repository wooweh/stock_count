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
  CountCheckProps,
  CountCommentsProps,
  CountItemProps,
  CountMembersProps,
  CountMetadataProps,
} from "../count/countSlice"
import {
  selectCountersUuidList,
  selectIsManagingCount,
  selectIsUserCountResultsEmpty,
  selectIsUserCounter,
  selectIsUserOrganiser,
} from "../count/countSliceSelectors"
import {
  removeCount,
  removeCountResultsItem,
  updateCountChecks,
  updateCountComments,
  updateCountMembers,
  updateCountMetadata,
  updateCountResultItem,
} from "../count/countSliceUtils"
import { HistoryProps } from "../history/historySlice"
import { updateHistory } from "../history/historySliceUtils"
import { OrgProps } from "../org/orgSlice"
import { selectOrgUuid } from "../org/orgSliceSelectors"
import { leaveOrg, updateMemberStatus, updateOrg } from "../org/orgSliceUtils"
import { StockProps } from "../stock/stockSlice"
import { updateStock } from "../stock/stockSliceUtils"
import { UserProps } from "../user/userSlice"
import {
  selectUserOrgUuid,
  selectUserUuid,
  selectUserUuidString,
} from "../user/userSliceSelectors"
import { updateUser } from "../user/userSliceUtils"
import {
  selectIsSystemActive,
  selectIsSystemBooting,
} from "./coreSliceSelectors"
import { setSystemIsBooted } from "./coreSliceUtils"
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
    if (isSafeToBoot) {
      setSystemIsBooted()
    }
  }, [isSafeToBoot])

  const isSafeToSync = !!userUuid && isSystemActive

  useEffect(() => {
    if (isSafeToSync) {
      const dbUserRef = ref(dbReal, getDBPath.user(userUuid).user)
      onValue(dbUserRef, (snapshot) => {
        const dbUser: UserProps = snapshot.val()
        updateUser(dbUser)
      })
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
  const localOrgUuid = useAppSelector(selectOrgUuid)

  const isSafeToSync = !!userUuid && !!userOrgUuid && isSystemActive

  useEffect(() => {
    if (isSafeToSync) {
      const dbOrgRef = ref(dbReal, getDBPath.org(userOrgUuid).org)
      onValue(dbOrgRef, (snapshot) => {
        const dbOrg: OrgProps = snapshot.val()
        const isUserMember = !!dbOrg && !!dbOrg.members![userUuid]
        const shouldJoinOrg = !!dbOrg && !localOrgUuid
        if (shouldJoinOrg) {
          updateMemberStatus("isJoined")
        }
        const shouldUpdateOrg = !!dbOrg && isUserMember
        if (shouldUpdateOrg) {
          updateOrg(dbOrg)
        }
        const shouldLeaveOrg = (!dbOrg || !isUserMember) && !!userOrgUuid
        if (shouldLeaveOrg) {
          leaveOrg()
        }
      })
    } else {
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
      onValue(dbStockRef, (snapshot) => {
        const dbStock: StockProps = snapshot.val()
        updateStock(dbStock)
      })
    } else {
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
      onValue(dbCountMetadataRef, (snapshot) => {
        const dbCountMetadata: CountMetadataProps = snapshot.val()
        if (!!dbCountMetadata) {
          updateCountMetadata(dbCountMetadata)
          const isRemoved =
            !dbCountMetadata.counters.includes(userUuid) &&
            !(dbCountMetadata.organiser === userUuid)
          if (isRemoved) removeCount(false)
        } else if (!dbCountMetadata && !isOrganiser) {
          removeCount(false)
        } else {
          if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).metadata))
        }
      })
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      const dbCountChecksRef = ref(dbReal, getDBPath.count(orgUuid).checks)
      onValue(dbCountChecksRef, (snapshot) => {
        const dbCountChecks: CountCheckProps[] = snapshot.val()
        if (!!dbCountChecks) {
          updateCountChecks(dbCountChecks)
        }
      })
    } else {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).checks))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      const dbCountCommentsRef = ref(dbReal, getDBPath.count(orgUuid).comments)
      onValue(dbCountCommentsRef, (snapshot) => {
        const dbCountComments: CountCommentsProps = snapshot.val()
        if (!!dbCountComments) {
          updateCountComments(dbCountComments)
        }
      })
    } else {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).comments))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      const dbCountMembersRef = ref(dbReal, getDBPath.count(orgUuid).members)
      onValue(dbCountMembersRef, (snapshot) => {
        const dbCountMembers: CountMembersProps = snapshot.val()
        if (!!dbCountMembers) {
          updateCountMembers(dbCountMembers)
        }
      })
    } else {
      if (!!orgUuid) off(ref(dbReal, getDBPath.count(orgUuid).members))
    }
  }, [isSafeToSyncCountData])

  useEffect(() => {
    if (isSafeToSyncCountData) {
      _.forEach(counterUuids, (memberUuid) => {
        if (userUuid !== memberUuid || isUserCountResultsEmpty) {
          onChildChanged(
            ref(
              dbReal,
              getDBPath.count(orgUuid).memberResults(memberUuid).results,
            ),
            (data) => {
              const result: CountItemProps = data.val()
              if (!!result) updateCountResultItem(result, memberUuid, false)
            },
          )
          onChildRemoved(
            ref(
              dbReal,
              getDBPath.count(orgUuid).memberResults(memberUuid).results,
            ),
            (data) => {
              const result: CountItemProps = data.val()
              if (!!result) removeCountResultsItem(result.id, memberUuid, false)
            },
          )
        }
      })
    } else {
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
      onValue(dbHistoryRef, (snapshot) => {
        const dbHistory: HistoryProps = snapshot.val()
        if (!!dbHistory) {
          updateHistory(dbHistory)
        } else {
          updateHistory({})
        }
      })
    } else {
      if (!!orgUuid) off(ref(dbReal, getDBPath.history(orgUuid).history))
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
