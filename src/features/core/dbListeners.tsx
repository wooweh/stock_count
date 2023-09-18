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
  selectCountChecks,
  selectCountComments,
  selectCountMembers,
  selectCountMetadata,
  selectCountResults,
  selectUserCountMemberStep,
  setCountChecks,
  setCountComments,
  setCountMembers,
  setCountMetaData,
  setCountResults,
  setCountStep,
} from "../count/countSlice"
import {
  OrgProps,
  leaveOrg,
  selectIsJoined,
  selectOrg,
  setMemberStatus,
  setOrg,
} from "../organisation/organisationSlice"
import { StockProps, selectStock, setStock } from "../stock/stockSlice"
import {
  UserProps,
  selectIsLocalUserOrgDetails,
  selectUser,
  setUser,
} from "../user/userSlice"
import {
  selectIsSystemActive,
  selectIsSystemBooting,
  setSystemStatus,
} from "./coreSlice"
/*





*/
export function DBListeners() {
  const dispatch = useAppDispatch()
  const isSystemActive = useAppSelector(selectIsSystemActive)
  const isSystemBooting = useAppSelector(selectIsSystemBooting)
  const localUser = useAppSelector(selectUser)
  const localOrg = useAppSelector(selectOrg)
  const localStock = useAppSelector(selectStock)
  const localCountChecks = useAppSelector(selectCountChecks)
  const localCountComments = useAppSelector(selectCountComments)
  const localCountMembers = useAppSelector(selectCountMembers)
  const localCountMetadata = useAppSelector(selectCountMetadata)
  const localCountResults = useAppSelector(selectCountResults)
  const localUserCountStep = useAppSelector(selectUserCountMemberStep)
  const isJoined = useAppSelector(selectIsJoined)
  const isLocalUserOrgDetails = useAppSelector(selectIsLocalUserOrgDetails)

  useEffect(() => {
    if (isSystemBooting && localUser.orgUuid && localOrg.uuid) {
      dispatch(setSystemStatus("isBooted"))
    }
    if (isSystemBooting && !localUser.orgUuid) {
      dispatch(setSystemStatus("isBooted"))
    }
  }, [isSystemBooting, dispatch, localUser, localOrg])

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
          dispatch(setUser(dbUser))
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
        getDBPath.org(localUser.orgUuid as string).org,
      )
      onValue(dbOrgRef, (snapshot) => {
        const dbOrg: OrgProps = snapshot.val()
        if (
          !!dbOrg &&
          !_.isEqual(localOrg, dbOrg) &&
          isLocalUserOrgDetails &&
          localUser.uuid! in dbOrg.members!
        ) {
          dispatch(setOrg(dbOrg))
          dispatch(setMemberStatus("isJoined"))
        }
        if (
          (!dbOrg || !(localUser.uuid! in dbOrg.members!)) &&
          isLocalUserOrgDetails
        ) {
          dispatch(leaveOrg(localOrg.uuid as string))
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
        getDBPath.stock(localUser.orgUuid as string).stock,
      )
      onValue(dbStockRef, (snapshot) => {
        const dbStock: StockProps = snapshot.val()
        if (!!dbStock && !_.isEqual(localStock, dbStock)) {
          dispatch(setStock(dbStock))
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
        getDBPath.count(localUser.orgUuid as string).checks,
      )
      onValue(dbCountChecksRef, (snapshot) => {
        const dbCountChecks: CountCheckProps[] = snapshot.val()
        if (!!dbCountChecks && !_.isEqual(localCountChecks, dbCountChecks)) {
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
        getDBPath.count(localUser.orgUuid as string).comments,
      )
      onValue(dbCountCommentsRef, (snapshot) => {
        const dbCountComments: CountCommentsProps = snapshot.val()
        if (
          !!dbCountComments &&
          !_.isEqual(localCountComments, dbCountComments)
        ) {
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
        getDBPath.count(localUser.orgUuid as string).members,
      )
      onValue(dbCountMembersRef, (snapshot) => {
        const dbCountMembers: CountMembersProps = snapshot.val()
        if (!!dbCountMembers && !_.isEqual(localCountMembers, dbCountMembers)) {
          dispatch(
            setCountMembers({ members: dbCountMembers, updateDB: false }),
          )
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountMetadataRef = ref(
        dbReal,
        getDBPath.count(localUser.orgUuid as string).metadata,
      )
      onValue(dbCountMetadataRef, (snapshot) => {
        const dbCountMetadata: CountMetadataProps = snapshot.val()
        if (
          !!dbCountMetadata &&
          !_.isEqual(localCountMetadata, dbCountMetadata)
        ) {
          dispatch(
            setCountMetaData({ metadata: dbCountMetadata, updateDB: false }),
          )
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localUser, isSystemActive])

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      const dbCountResultsRef = ref(
        dbReal,
        getDBPath.count(localUser.orgUuid as string).results,
      )
      onValue(dbCountResultsRef, (snapshot) => {
        const dbCountResults: CountResultsProps = snapshot.val()
        if (!!dbCountResults && !_.isEqual(localCountResults, dbCountResults)) {
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
      // TODO
    }
  }, [dispatch, localUser, isSystemActive, isJoined])

  return undefined
}
