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
type UseOrgState = {
  isRemoving: boolean
  isEditing: boolean
  isJoining: boolean
  isCreating: boolean
  isInviting: boolean
  isViewingMembers: boolean
  isViewingInvites: boolean
}
type UseOrgKeys = keyof UseOrgState
const initialState: UseOrgState = {
  isRemoving: false,
  isEditing: false,
  isJoining: false,
  isCreating: false,
  isInviting: false,
  isViewingMembers: false,
  isViewingInvites: false,
}
export const useOrgStore = create<UseOrgState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    {
      name: "organisation-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export function setUseOrg(path: UseOrgKeys, value: boolean | string) {
  useOrgStore.setState({ [path]: value })
}

export function resetUseOrg() {
  useOrgStore.setState(initialState)
}
/*





*/
export function Org() {
  const isProfileComplete = useAppSelector(selectIsProfileComplete)
  const isOrgSetup = useAppSelector(selectIsOrgSetup)
  const isJoiningOrg = useAppSelector(selectIsJoining)

  return isProfileComplete ? (
    isJoiningOrg ? (
      <Loader narration={"joining organisation..."} />
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
