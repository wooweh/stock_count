import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppSelector } from "../../app/hooks"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Loader } from "../../components/loader"
import { CompleteProfilePrompt, VerifyEmailPrompt } from "../core/home"
import { selectIsProfileComplete } from "../user/userSliceSelectors"
import { selectIsJoining, selectIsOrgSetup } from "./orgSliceSelectors"
import { OrgProfile } from "./profile"
import { OrgSetup } from "./setup"
/*




*/
type OrgUIState = {
  isRemoving: boolean
  isEditing: boolean
  isJoining: boolean
  isCreating: boolean
  isInviting: boolean
  isViewingMembers: boolean
  isViewingInvites: boolean
}
type OrgUIKeys = keyof OrgUIState
const initialState: OrgUIState = {
  isRemoving: false,
  isEditing: false,
  isJoining: false,
  isCreating: false,
  isInviting: false,
  isViewingMembers: false,
  isViewingInvites: false,
}
export const useOrgUI = create<OrgUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    {
      name: "org-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export function setOrgUI(path: OrgUIKeys, value: boolean | string) {
  useOrgUI.setState({ [path]: value })
}

export function resetOrgUI() {
  useOrgUI.setState(initialState)
}
/*




*/
export default function Org() {
  const location = useLocation()

  const isProfileComplete = useAppSelector(selectIsProfileComplete)
  const isOrgSetup = useAppSelector(selectIsOrgSetup)
  const isJoiningOrg = useAppSelector(selectIsJoining)

  const orgUIState = useOrgUI((state) => state)

  const [isEmailVerified, setIsEmailVerified] = useState(true)

  const path = location.pathname

  useEffect(() => {
    const interval = setInterval(() => {
      onAuthStateChanged(getAuth(), (user) => {
        if (!!user) setIsEmailVerified(!!user.emailVerified)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary
      componentName={"Org"}
      featurePath={path}
      state={{ featureUI: { ...orgUIState } }}
    >
      {!isProfileComplete ? (
        <CompleteProfilePrompt />
      ) : !isEmailVerified ? (
        <VerifyEmailPrompt />
      ) : isJoiningOrg ? (
        <Loader narration={"joining org"} />
      ) : isOrgSetup ? (
        <OrgProfile />
      ) : (
        <OrgSetup />
      )}
    </ErrorBoundary>
  )
}
/*




*/
