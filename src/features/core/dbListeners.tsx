import { onValue, ref } from "firebase/database"
import _ from "lodash"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  CountCheckProps,
  CountCommentsProps,
  CountMembersProps,
  CountMetadataProps,
  CountResultsProps,
  deleteCount,
  selectCountMembers,
  selectCountMetadata,
  setCountChecks,
  setCountComments,
  setCountMembers,
  setCountMetaData,
  setCountResults,
} from "../count/countSlice"
import { updateCountStep } from "../count/countUtils"
import { HistoryProps, setHistory } from "../history/historySlice"
import {
  OrgProps,
  selectIsJoined,
  selectOrg,
  setMemberStatus,
  setOrg,
} from "../org/orgSlice"
import { StockProps, setStock } from "../stock/stockSlice"
import {
  UserProps,
  selectIsLocalUserOrgDetails,
  selectUser,
} from "../user/userSlice"
import { updateUser } from "../user/userSliceUtils"
import { selectIsSystemActive, selectIsSystemBooting } from "./coreSlice"
import { setSystemIsBooted } from "./coreSliceUtils"
import { leaveOrg } from "../org/orgSliceUtils"
/*





*/
export function DBListeners() {
  const dispatch = useAppDispatch()
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const isSystemBooting = useAppSelector(selectIsSystemBooting)
  const localUser = useAppSelector(selectUser)
  const localOrg = useAppSelector(selectOrg)
  const localCountMembers = useAppSelector(selectCountMembers)
  const localCountMetadata = useAppSelector(selectCountMetadata)
  const isJoined = useAppSelector(selectIsJoined)
  const isLocalUserOrgDetails = useAppSelector(selectIsLocalUserOrgDetails)

  useEffect(() => {
    if (isSystemBooting && localUser.org?.uuid && localOrg.uuid) {
      setSystemIsBooted()
    }
    if (isSystemBooting && !localUser.org?.uuid) {
      setSystemIsBooted()
    }
  }, [isSystemBooting, localUser, localOrg])

  // USER LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbUserRef = ref(
        dbReal,
        getDBPath.user(localUser.uuid as string).user,
      )
      onValue(dbUserRef, (snapshot) => {
        const dbUser: UserProps = snapshot.val()
        if (!_.isEqual(localUser, dbUser)) {
          updateUser(dbUser)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  // ORG SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbOrgRef = ref(
        dbReal,
        getDBPath.org(localUser.org?.uuid as string).org,
      )
      onValue(dbOrgRef, (snapshot) => {
        const dbOrg: OrgProps = snapshot.val()
        if (
          !!dbOrg &&
          isLocalUserOrgDetails &&
          localUser.uuid! in dbOrg.members!
        ) {
          dispatch(setOrg({ org: dbOrg, updateDB: false }))
          dispatch(setMemberStatus("isJoined"))
        }
        if (
          (!dbOrg || !(localUser.uuid! in dbOrg.members!)) &&
          isLocalUserOrgDetails
        ) {
          leaveOrg()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  // STOCK SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbStockRef = ref(
        dbReal,
        getDBPath.stock(localUser.org?.uuid as string).stock,
      )
      onValue(dbStockRef, (snapshot) => {
        const dbStock: StockProps = snapshot.val()
        if (!!dbStock) {
          dispatch(setStock({ stock: dbStock, updateDB: false }))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  // COUNT SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountChecksRef = ref(
        dbReal,
        getDBPath.count(localUser.org?.uuid as string).checks,
      )
      onValue(dbCountChecksRef, (snapshot) => {
        const dbCountChecks: CountCheckProps[] = snapshot.val()
        if (!!dbCountChecks) {
          dispatch(setCountChecks({ checks: dbCountChecks, updateDB: false }))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountCommentsRef = ref(
        dbReal,
        getDBPath.count(localUser.org?.uuid as string).comments,
      )
      onValue(dbCountCommentsRef, (snapshot) => {
        const dbCountComments: CountCommentsProps = snapshot.val()
        if (!!dbCountComments) {
          dispatch(
            setCountComments({ comments: dbCountComments, updateDB: false }),
          )
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountMembersRef = ref(
        dbReal,
        getDBPath.count(localUser.org?.uuid as string).members,
      )
      onValue(dbCountMembersRef, (snapshot) => {
        const dbCountMembers: CountMembersProps = snapshot.val()
        if (!!dbCountMembers) {
          dispatch(
            setCountMembers({ members: dbCountMembers, updateDB: false }),
          )
        }
        if (!dbCountMembers && !!localCountMembers) {
          updateCountStep("dashboard", false)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountMetadataRef = ref(
        dbReal,
        getDBPath.count(localUser.org?.uuid as string).metadata,
      )
      onValue(dbCountMetadataRef, (snapshot) => {
        const dbCountMetadata: CountMetadataProps = snapshot.val()
        if (!!dbCountMetadata) {
          dispatch(
            setCountMetaData({ metadata: dbCountMetadata, updateDB: false }),
          )
        } else if (!dbCountMetadata && !!localCountMetadata) {
          dispatch(deleteCount())
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountResultsRef = ref(
        dbReal,
        getDBPath.count(localUser.org?.uuid as string).results,
      )
      onValue(dbCountResultsRef, (snapshot) => {
        const dbCountResults: CountResultsProps = snapshot.val()
        if (!!dbCountResults) {
          dispatch(setCountResults(dbCountResults))
        } else if (dbCountResults === null) {
          dispatch(setCountResults({}))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  // HISTORY SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbHistoryRef = ref(
        dbReal,
        getDBPath.history(localUser.org?.uuid as string).history,
      )
      onValue(dbHistoryRef, (snapshot) => {
        const dbHistory: HistoryProps = snapshot.val()
        if (!!dbHistory) {
          dispatch(setHistory(dbHistory))
        } else if (dbHistory === null) {
          dispatch(setHistory({}))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive, isJoined])

  return undefined
}
