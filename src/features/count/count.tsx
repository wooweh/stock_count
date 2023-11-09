import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import useTheme from "../../common/useTheme"
import Modal, { ModalActionProps } from "../../components/modal"
import { leaveCount, removeCount } from "./countSliceUtils"
import { Steps } from "./steps"
import { CountTypes } from "./countSlice"
/*




*/
type CountUIState = {
  isSettingUp: boolean
  isManagingCheckList: boolean
  isCounterRequirementMet: boolean
  isAddingMembers: boolean
  isAddingPrepComment: boolean
  isStartingCount: boolean
  isAddingStockItem: boolean
  isReviewMetadataSubmitted: boolean
  isCountOptionsOpen: boolean
  isDeletingCount: boolean
  isLeavingCount: boolean
  isStartingFinalization: boolean
  isSubmittingFinalization: boolean
  currentlyViewedStockItemId: false | string
  currentlyViewedStockItemUseableCount: number
  currentlyViewedStockItemDamagedCount: number
  currentlyViewedStockItemObsoleteCount: number
  scrollIndex: number
  selectedMemberUuids: string[]
  satisfiedCheckUuids: string[]
  prepCommments: string[]
  finalComments: string[]
  tempCountType: CountTypes
}
type CountUIKeys = keyof CountUIState
const initialState: CountUIState = {
  isSettingUp: false,
  isManagingCheckList: false,
  isCounterRequirementMet: false,
  isAddingMembers: false,
  isAddingPrepComment: false,
  isStartingCount: false,
  isAddingStockItem: false,
  isReviewMetadataSubmitted: false,
  isCountOptionsOpen: false,
  isDeletingCount: false,
  isLeavingCount: false,
  isStartingFinalization: false,
  isSubmittingFinalization: false,
  currentlyViewedStockItemId: false,
  currentlyViewedStockItemUseableCount: 0,
  currentlyViewedStockItemDamagedCount: 0,
  currentlyViewedStockItemObsoleteCount: 0,
  scrollIndex: 0,
  selectedMemberUuids: [],
  satisfiedCheckUuids: [],
  prepCommments: [],
  finalComments: [],
  tempCountType: "solo",
}
export const useCountUI = create<CountUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "count-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

export function setCountUI(path: CountUIKeys, value: any) {
  useCountUI.setState({ [path]: value })
}
export function addCountUISelectedMemberUuid(uuid: string) {
  const uuids = useCountUI.getState().selectedMemberUuids
  const index = _.indexOf(uuids, uuid)
  if (index === -1) {
    const newUuids = [uuid, ...uuids]
    useCountUI.setState({ selectedMemberUuids: newUuids })
  }
}
export function removeCountUISelectedMemberUuid(uuid: string) {
  const uuids = useCountUI.getState().selectedMemberUuids
  const indexToRemove = _.indexOf(uuids, uuid)
  const newUuids = [...uuids]
  newUuids.splice(indexToRemove, 1)
  useCountUI.setState({ selectedMemberUuids: newUuids })
}
export function addCountUISatisfiedCheckUuid(uuid: string) {
  const uuids = useCountUI.getState().satisfiedCheckUuids
  const index = _.indexOf(uuids, uuid)
  if (index === -1) {
    const newUuids = [uuid, ...uuids]
    useCountUI.setState({ satisfiedCheckUuids: newUuids })
  }
}
export function removeCountUISatisfiedCheckUuid(uuid: string) {
  const uuids = useCountUI.getState().satisfiedCheckUuids
  const indexToRemove = _.indexOf(uuids, uuid)
  const newUuids = [...uuids]
  newUuids.splice(indexToRemove, 1)
  useCountUI.setState({ satisfiedCheckUuids: newUuids })
}
export function addCountUIPrepComment(comment: string) {
  const comments = useCountUI.getState().prepCommments
  const newComments = [...comments, comment]
  useCountUI.setState({ prepCommments: newComments })
}
export function editCountUIPrepComment(index: number, comment: string) {
  const comments = useCountUI.getState().prepCommments
  if (index >= 0 && index < comments.length) {
    const newComments = [...comments]
    newComments[index] = comment
    useCountUI.setState({ prepCommments: newComments })
  }
}
export function removeCountUIPrepComment(index: number) {
  const comments = useCountUI.getState().prepCommments
  const newComments = [...comments]
  newComments.splice(index, 1)
  useCountUI.setState({ prepCommments: newComments })
}
export function addCountUIFinalComment(comment: string) {
  const comments = useCountUI.getState().finalComments
  const newComments = [...comments, comment]
  useCountUI.setState({ finalComments: newComments })
}
export function editCountUIFinalComment(index: number, comment: string) {
  const comments = useCountUI.getState().finalComments
  if (index >= 0 && index < comments.length) {
    const newComments = [...comments]
    newComments[index] = comment
    useCountUI.setState({ finalComments: newComments })
  }
}
export function removeCountUIFinalComment(index: number) {
  const comments = useCountUI.getState().finalComments
  const newComments = [...comments]
  newComments.splice(index, 1)
  useCountUI.setState({ finalComments: newComments })
}
export function resetCountUI() {
  useCountUI.setState(initialState)
}
/*




*/
export function Count() {
  return (
    <>
      <Steps />
      <LeaveCountConfirmation />
      <DeleteCountConfirmation />
    </>
  )
}
/*




*/
function LeaveCountConfirmation() {
  const isOpen = useCountUI((state) => state.isLeavingCount)

  function handleClose() {
    setCountUI("isLeavingCount", false)
  }

  function handleAccept() {
    leaveCount()
    setCountUI("isLeavingCount", false)
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  return (
    <Modal
      open={isOpen}
      heading={"Leave Count"}
      body={<LeaveCountConfirmationBody />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
function LeaveCountConfirmationBody() {
  const theme = useTheme()

  return (
    <Stack width={"100%"} gap={theme.module[3]} alignItems={"center"}>
      <Typography textAlign={"center"}>
        You are leaving the count. You can return using the Dashboard.
      </Typography>
      <Typography>Are you sure you want to leave?</Typography>
    </Stack>
  )
}
/*




*/
function DeleteCountConfirmation() {
  const isOpen = useCountUI((state) => state.isDeletingCount)

  function handleClose() {
    setCountUI("isDeletingCount", false)
  }

  function handleAccept() {
    removeCount()
    resetCountUI()
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  return (
    <Modal
      open={isOpen}
      heading={"Delete Count"}
      body={<DeleteCountConfirmationBody />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*
  
  
  
  
  
*/
function DeleteCountConfirmationBody() {
  const theme = useTheme()

  return (
    <Stack width={"100%"} gap={theme.module[3]} alignItems={"center"}>
      <Typography textAlign={"center"}>
        You are about to delete the count. All count data will be lost.
      </Typography>
      <Typography>Are you sure you want to continue?</Typography>
    </Stack>
  )
}
/*
 
 
 
 
 
*/
