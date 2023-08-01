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
import { selectIsSystemBooted } from "./coreSlice"
/*





*/
export function DBListeners() {
  const dispatch = useAppDispatch()
  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const localUser = useAppSelector(selectUser)
  const localOrg = useAppSelector(selectOrg)
  const localStock = useAppSelector(selectStock)
  const isJoined = useAppSelector(selectIsJoined)

  // USER LISTENER

  useEffect(() => {
    if (!!localUser && isSystemBooted) {
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
  }, [dispatch, localUser, isSystemBooted])

  // ORG SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemBooted) {
      const localUserOrgDetails = !!localUser.orgRole && !!localUser.orgUuid

      const dbOrgRef = ref(
        dbReal,
        getDBPath.org(localUser.orgUuid as string).org,
      )
      onValue(dbOrgRef, (snapshot) => {
        const dbOrg: OrgProps = snapshot.val()
        if (
          !!dbOrg &&
          !_.isEqual(localOrg, dbOrg) &&
          localUserOrgDetails &&
          localUser.uuid! in dbOrg.members!
        ) {
          dispatch(setOrg(dbOrg))
          dispatch(setMemberStatus("isJoined"))
        }
        if (
          (!dbOrg || !(localUser.uuid! in dbOrg.members!)) &&
          localUserOrgDetails
        ) {
          dispatch(leaveOrg(localOrg.uuid as string))
        }
      })
    }
  }, [dispatch, localUser, localOrg, isSystemBooted])

  // STOCK SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemBooted) {
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
  }, [dispatch, localUser, localStock, isSystemBooted])

  // HISTORY SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemBooted) {
      // TODO
    }
  }, [dispatch, localUser, isSystemBooted, isJoined])

  // COUNT SET & LISTENER

  useEffect(() => {
    if (!!localUser && isSystemBooted) {
      // TODO
    }
  }, [dispatch, localUser, isSystemBooted, isJoined])

  return undefined
}
