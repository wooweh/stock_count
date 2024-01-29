import { Typography } from "@mui/material"
import _ from "lodash"
import { useLocation } from "react-router-dom"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import useTheme from "../../common/useTheme"
import { ErrorBoundary } from "../../components/errorBoundary"
import Modal, { ModalActionProps } from "../../components/modal"
import { Window } from "../../components/surface"
import { CountTypes } from "./countSlice"
import { leaveCount, removeCount } from "./countSliceUtils"
import { Steps } from "./steps"
import { Fade } from "../../components/fade"
/*




*/
export type CountUIState = {
  isSettingUp: boolean
  isManagingCheckList: boolean
  isManagingCount: boolean
  isUpdatingCount: boolean
  isEditingCheckList: boolean
  isCounterRequirementMet: boolean
  isAddingMembers: boolean
  isAddingTempMembers: boolean
  isAddingPrepComment: boolean
  isStartingCount: boolean
  isAddingStockItem: boolean
  isReviewMetadataSubmitted: boolean
  isCountOptionsOpen: boolean
  isDeletingCount: boolean
  isLeavingCount: boolean
  isStartingFinalization: boolean
  isSubmittingFinalization: boolean
  currentStockItemId: false | string
  currentStockItemUseableCount: number
  currentStockItemDamagedCount: number
  currentStockItemObsoleteCount: number
  scrollIndex: number
  selectedMemberUuids: string[]
  satisfiedCheckUuids: string[]
  prepComments: string[]
  finalComments: string[]
  tempCountType: CountTypes
  tempAddedMemberUuids: string[]
  tempRemovedMemberUuids: string[]
  tempResultsTransfers: { [key: string]: string }
}
type ConstructStringUnionFromKeyOfValueMatch<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]
type ConstructStringUnionFromKeyMatch<T, U extends string[]> = {
  [K in keyof T]: K extends U[number] ? K : never
}[keyof T]

export type CountUIKeys = keyof CountUIState
export type CountUIKeysWithItemArrays = ConstructStringUnionFromKeyOfValueMatch<
  CountUIState,
  string[]
>
export type CountUIKeysWithStringKeyValuePairs =
  ConstructStringUnionFromKeyOfValueMatch<
    CountUIState,
    { [key: string]: string }
  >
export type ArrayWithEditableItemsUIState = ConstructStringUnionFromKeyMatch<
  CountUIState,
  ["finalComments", "prepComments"]
>

const initialState: CountUIState = {
  isSettingUp: false,
  isManagingCheckList: false,
  isManagingCount: false,
  isUpdatingCount: false,
  isEditingCheckList: false,
  isCounterRequirementMet: false,
  isAddingMembers: false,
  isAddingTempMembers: false,
  isAddingPrepComment: false,
  isStartingCount: false,
  isAddingStockItem: false,
  isReviewMetadataSubmitted: false,
  isCountOptionsOpen: false,
  isDeletingCount: false,
  isLeavingCount: false,
  isStartingFinalization: false,
  isSubmittingFinalization: false,
  currentStockItemId: false,
  currentStockItemUseableCount: 0,
  currentStockItemDamagedCount: 0,
  currentStockItemObsoleteCount: 0,
  scrollIndex: 0,
  tempCountType: "solo",
  selectedMemberUuids: [],
  satisfiedCheckUuids: [],
  prepComments: [],
  finalComments: [],
  tempAddedMemberUuids: [],
  tempRemovedMemberUuids: [],
  tempResultsTransfers: {},
}
export const useCountUI = create<CountUIState>()(
  persist((set) => ({ ...initialState }), {
    name: "count-storage",
    storage: createJSONStorage(() => sessionStorage),
  }),
)

export function setCountUI(path: CountUIKeys, value: any) {
  useCountUI.setState({ [path]: value })
}
export function addCountUIArrayItem(
  key: CountUIKeysWithItemArrays,
  value: string,
) {
  useCountUI.setState((state) => ({
    [key]: _.uniq([...state[key], value]),
  }))
}
export function removeCountUIArrayItem(
  key: CountUIKeysWithItemArrays,
  value: string,
) {
  useCountUI.setState((state) => ({
    [key]: _.without(state[key], value),
  }))
}
export function editCountUIArrayItem(
  key: ArrayWithEditableItemsUIState,
  index: number,
  value: string,
) {
  useCountUI.setState((state) => {
    const isDuplicate = state[key].includes(value)
    const isBlank = state[key][index] === ""
    const first = state[key].slice(0, index)
    const last = state[key].slice(index + 1)
    if (isDuplicate && isBlank) {
      return { [key]: _.without(state[key], "") }
    } else if (isDuplicate && !isBlank) {
      return state
    } else {
      return { [key]: [...first, value, ...last] }
    }
  })
}
export function addCountUIKeyValuePair(
  key: CountUIKeysWithStringKeyValuePairs,
  value: { [key: string]: string },
) {
  useCountUI.setState((state) => ({
    [key]: { ...state[key], ...value },
  }))
}
export function removeCountUIKeyValuePair(
  key: CountUIKeysWithStringKeyValuePairs,
  value: string,
) {
  useCountUI.setState((state) => ({
    [key]: _.omit(state[key], value),
  }))
}
export function removeCountUIKeyValuePairValue(
  key: CountUIKeysWithStringKeyValuePairs,
  value: string,
) {
  useCountUI.setState((state) => {
    const transferPair = _.pickBy(state[key], (v) => v === value)
    const fromUuid = _.keys(transferPair)[0]
    return !!fromUuid ? { [key]: { ...state[key], [fromUuid]: "" } } : state
  })
}

export function resetCountUI() {
  useCountUI.setState(initialState)
}
/*




*/
export function Count() {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <>
      <ErrorBoundary
        componentName={"Count"}
        featurePath={path}
        state={{ featureUI: { ...countUIState } }}
      >
        <Fade>
          <Steps />
          <LeaveCountConfirmation />
          <DeleteCountConfirmation />
        </Fade>
      </ErrorBoundary>
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
    <Window gap={theme.module[3]}>
      <Typography textAlign={"center"}>
        You are leaving the count. You can re-join using the Dashboard. No data
        will be lost.
      </Typography>
      <Typography>Are you sure you want to leave?</Typography>
    </Window>
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
    <Window gap={theme.module[3]}>
      <Typography textAlign={"center"}>
        You are about to delete the count. All count data will be lost.
      </Typography>
      <Typography>Are you sure you want to continue?</Typography>
    </Window>
  )
}
/*
 
 
 
 
 
*/
