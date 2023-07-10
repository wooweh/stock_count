import { onValue, ref } from "firebase/database"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { dbReal } from "../../remote_config"
import { OrgProps, leaveOrg, setOrg } from "../organisation/organisationSlice"
import {
  UserProps,
  selectUserOrgRole,
  selectUserOrgUuid,
  selectUserUuid,
  setUserOrgRole,
} from "../user/userSlice"
/*





*/
export function DBListeners({ isSystemBooted }: { isSystemBooted: boolean }) {
  const dispatch = useAppDispatch()
  const userOrgUuid = useAppSelector(selectUserOrgUuid)
  const userUuid = useAppSelector(selectUserUuid)
  const userOrgRole = useAppSelector(selectUserOrgRole)

  // USER LISTENER

  useEffect(() => {
    if (!!userUuid && isSystemBooted) {
      const userDBRef = ref(dbReal, `users/${userUuid}`)
      return onValue(userDBRef, (snapshot) => {
        const userOnDB: UserProps = snapshot.val()
        const userOrgRoleOnDB = userOnDB.orgRole
        if (!!userOrgRoleOnDB && userOrgRole !== userOrgRoleOnDB) {
          dispatch(setUserOrgRole(userOrgRoleOnDB))
        }

        const userOrgUuidOnDB = userOnDB.orgUuid
        if (!!userOrgUuid && !userOrgUuidOnDB) {
          dispatch(leaveOrg())
        }
      })
    }
  }, [userOrgRole, dispatch, userUuid, userOrgUuid, isSystemBooted])

  // ORG SET & LISTENER

  useEffect(() => {
    if (!!userOrgUuid && isSystemBooted) {
      const orgDBRef = ref(dbReal, `organisations/${userOrgUuid}`)
      return onValue(orgDBRef, (snapshot) => {
        const orgOnDB: OrgProps = snapshot.val()
        if (orgOnDB) dispatch(setOrg(orgOnDB))
        if (!orgOnDB) dispatch(leaveOrg())
      })
    }
  }, [dispatch, userOrgUuid, isSystemBooted])

  // STOCK SET & LISTENER

  useEffect(() => {
    if (!!userOrgUuid && isSystemBooted) {
      // TODO
    }
  }, [dispatch, userOrgUuid, isSystemBooted])

  // HISTORY SET & LISTENER

  useEffect(() => {
    if (!!userOrgUuid && isSystemBooted) {
      // TODO
    }
  }, [dispatch, userOrgUuid, isSystemBooted])

  // COUNT SET & LISTENER

  useEffect(() => {
    if (!!userOrgUuid && isSystemBooted) {
      // TODO
    }
  }, [dispatch, userOrgUuid, isSystemBooted])

  return undefined
}
