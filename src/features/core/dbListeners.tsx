import { onValue, ref } from "firebase/database"
import _ from "lodash"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  OrgProps,
  leaveOrg,
  selectIsJoined,
  selectOrg,
  setMemberStatus,
  setOrg,
} from "../organisation/organisationSlice"
import { StockProps, selectStock, setStock } from "../stock/stockSlice"
import { UserProps, selectUser, setUser } from "../user/userSlice"
import {
  selectIsSystemActive,
  selectIsSystemBooted,
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
  const isJoined = useAppSelector(selectIsJoined)

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
      const isLocalUserOrgDetails = !!localUser.orgRole && !!localUser.orgUuid

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
  }, [dispatch, localUser, localOrg, isSystemActive])

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
  }, [dispatch, localUser, localStock, isSystemActive])

  // HISTORY SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      // TODO
    }
  }, [dispatch, localUser, isSystemActive, isJoined])

  // COUNT SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemActive) {
      // TODO
    }
  }, [dispatch, localUser, isSystemActive, isJoined])

  return undefined
}
