import { onValue, ref } from "firebase/database"
import _ from "lodash"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  CountCheckProps,
  CountCommentsProps,
  CountMemberResultsProps,
  CountMembersProps,
  CountMetadataProps,
} from "../count/countSlice"
import {
  selectCountMembers,
  selectCountMetadata,
  selectCountersUuidList,
  selectIsUserOrganiser,
} from "../count/countSliceSelectors"
import {
  removeCount,
  updateCountChecks,
  updateCountComments,
  updateCountMemberResults,
  updateCountMembers,
  updateCountMetadata,
} from "../count/countSliceUtils"
import { HistoryProps } from "../history/historySlice"
import { updateHistory } from "../history/historySliceUtils"
import { OrgProps } from "../org/orgSlice"
import { selectOrgUuid } from "../org/orgSliceSelectors"
import { leaveOrg, updateMemberStatus, updateOrg } from "../org/orgSliceUtils"
import { StockProps } from "../stock/stockSlice"
import { updateStock } from "../stock/stockSliceUtils"
import { UserProps } from "../user/userSlice"
import { selectUserOrgUuid, selectUserUuid } from "../user/userSliceSelectors"
import { updateUser } from "../user/userSliceUtils"
import {
  selectIsSystemActive,
  selectIsSystemBooting,
} from "./coreSliceSelectors"
import { setSystemIsBooted } from "./coreSliceUtils"
import { routePaths } from "./pages"
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
        const isUserMember = !!dbOrg.members![userUuid]

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
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
export function CountDBListener() {
  const location = useLocation()

  const userUuid = useAppSelector(selectUserUuid)
  const orgUuid = useAppSelector(selectUserOrgUuid)
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const localCountMembers = useAppSelector(selectCountMembers)
  const localCountMetadata = useAppSelector(selectCountMetadata)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const counterUuids = useAppSelector(selectCountersUuidList)

  const pathName = location.pathname
  const isCountPath = pathName === routePaths.count.path
  const isSafeToSync = !!userUuid && !!orgUuid && isSystemActive && isCountPath

  useEffect(() => {
    if (isSafeToSync) {
      const dbCountChecksRef = ref(dbReal, getDBPath.count(orgUuid).checks)
      onValue(dbCountChecksRef, (snapshot) => {
        const dbCountChecks: CountCheckProps[] = snapshot.val()
        if (!!dbCountChecks) {
          updateCountChecks(dbCountChecks)
        }
      })
    }
  }, [isSafeToSync])

  useEffect(() => {
    if (isSafeToSync) {
      const dbCountCommentsRef = ref(dbReal, getDBPath.count(orgUuid).comments)
      onValue(dbCountCommentsRef, (snapshot) => {
        const dbCountComments: CountCommentsProps = snapshot.val()
        if (!!dbCountComments) {
          updateCountComments(dbCountComments)
        }
      })
    }
  }, [isSafeToSync])

  useEffect(() => {
    if (isSafeToSync) {
      const dbCountMembersRef = ref(dbReal, getDBPath.count(orgUuid).members)
      onValue(dbCountMembersRef, (snapshot) => {
        const dbCountMembers: CountMembersProps = snapshot.val()
        if (!!dbCountMembers) {
          updateCountMembers(dbCountMembers)
        } else if (!!localCountMembers && !isOrganiser) {
          removeCount()
        }
      })
    }
  }, [isSafeToSync])

  useEffect(() => {
    if (isSafeToSync) {
      const dbCountMetadataRef = ref(dbReal, getDBPath.count(orgUuid).metadata)
      onValue(dbCountMetadataRef, (snapshot) => {
        const dbCountMetadata: CountMetadataProps = snapshot.val()
        if (!!dbCountMetadata) {
          updateCountMetadata(dbCountMetadata)
        } else if (!!localCountMetadata && !isOrganiser) {
          removeCount()
        }
      })
    }
  }, [isSafeToSync])

  useEffect(() => {
    if (isSafeToSync) {
      _.forEach(counterUuids, (uuid) => {
        if (userUuid !== uuid) {
          const dbCounterResultsRef = ref(
            dbReal,
            getDBPath.count(orgUuid).memberResults(uuid).results,
          )
          onValue(dbCounterResultsRef, (snapshot) => {
            const dbCounterResults: CountMemberResultsProps = snapshot.val()
            if (!!dbCounterResults) {
              updateCountMemberResults(uuid, dbCounterResults)
            } else {
              updateCountMemberResults(uuid, {})
            }
          })
        }
      })
    }
  }, [isSafeToSync, counterUuids])

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
    }
  }, [isSafeToSync])

  return undefined
}
/*




*/
