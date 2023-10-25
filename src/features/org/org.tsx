import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppSelector } from "../../app/hooks"
import { Loader } from "../../components/loader"
import { CompleteProfilePrompt } from "../core/home"
import { selectIsProfileComplete } from "../user/userSlice"
import { selectIsJoining, selectIsOrgSetup } from "./orgSlice"
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
export function Org() {
  const isProfileComplete = useAppSelector(selectIsProfileComplete)
  const isOrgSetup = useAppSelector(selectIsOrgSetup)
  const isJoiningOrg = useAppSelector(selectIsJoining)

  return isProfileComplete ? (
    isJoiningOrg ? (
      <Loader narration={"joining org..."} />
    ) : isOrgSetup ? (
      <OrgProfile />
    ) : (
      <OrgSetup />
    )
  ) : (
    <CompleteProfilePrompt />
  )
}
/*




*/
