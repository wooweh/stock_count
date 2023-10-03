import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { getTimeStamp } from "../../common/utils"
import Animation from "../../components/animation"
import { Button } from "../../components/button"
import { IconNames } from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import {
  CountSteps,
  CountTypes,
  deleteCount,
  selectCountStep,
  selectCountersUuidList,
  selectIsStockCountCompleted,
  selectIsUserCounting,
  selectIsUserOnlyOrganiser,
  selectIsUserOrganiser,
} from "./countSlice"
import {
  createCountMetadata,
  updateCountComments,
  updateCountMetadata,
  updateCountStep,
  updateUserCountMember,
} from "./countUtils"
import { DashboardBody } from "./dashboard"
import { FinalizationBody } from "./finalization"
import { PreparationBody } from "./preparation"
import { ReviewBody } from "./review"
import { SetupBody } from "./setup"
import { StockCountBody } from "./stockCount"
/*





*/
type UseCountState = {
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
  tempCountType: string
}
type UseCountKeys = keyof UseCountState
const initialState: UseCountState = {
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
  tempCountType: "",
}
export const useCountStore = create<UseCountState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "count-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

export function setUseCount(path: UseCountKeys, value: any) {
  useCountStore.setState({ [path]: value })
}
export function addUseCountSelectedMemberUuid(uuid: string) {
  const uuids = useCountStore.getState().selectedMemberUuids
  const index = _.indexOf(uuids, uuid)
  if (index === -1) {
    const newUuids = [uuid, ...uuids]
    useCountStore.setState({ selectedMemberUuids: newUuids })
  }
}
export function removeUseCountSelectedMemberUuid(uuid: string) {
  const uuids = useCountStore.getState().selectedMemberUuids
  const indexToRemove = _.indexOf(uuids, uuid)
  const newUuids = [...uuids]
  newUuids.splice(indexToRemove, 1)
  useCountStore.setState({ selectedMemberUuids: newUuids })
}
export function addUseCountSatisfiedCheckUuid(uuid: string) {
  const uuids = useCountStore.getState().satisfiedCheckUuids
  const index = _.indexOf(uuids, uuid)
  if (index === -1) {
    const newUuids = [uuid, ...uuids]
    useCountStore.setState({ satisfiedCheckUuids: newUuids })
  }
}
export function removeUseCountSatisfiedCheckUuid(uuid: string) {
  const uuids = useCountStore.getState().satisfiedCheckUuids
  const indexToRemove = _.indexOf(uuids, uuid)
  const newUuids = [...uuids]
  newUuids.splice(indexToRemove, 1)
  useCountStore.setState({ satisfiedCheckUuids: newUuids })
}
export function addUseCountPrepComment(comment: string) {
  const comments = useCountStore.getState().prepCommments
  const newComments = [...comments, comment]
  useCountStore.setState({ prepCommments: newComments })
}
export function editUseCountPrepComment(index: number, comment: string) {
  const comments = useCountStore.getState().prepCommments
  if (index >= 0 && index < comments.length) {
    const newComments = [...comments]
    newComments[index] = comment
    useCountStore.setState({ prepCommments: newComments })
  }
}
export function removeUseCountPrepComment(index: number) {
  const comments = useCountStore.getState().prepCommments
  const newComments = [...comments]
  newComments.splice(index, 1)
  useCountStore.setState({ prepCommments: newComments })
}
export function addUseCountFinalComment(comment: string) {
  const comments = useCountStore.getState().finalComments
  const newComments = [...comments, comment]
  useCountStore.setState({ finalComments: newComments })
}
export function editUseCountFinalComment(index: number, comment: string) {
  const comments = useCountStore.getState().finalComments
  if (index >= 0 && index < comments.length) {
    const newComments = [...comments]
    newComments[index] = comment
    useCountStore.setState({ finalComments: newComments })
  }
}
export function removeUseCountFinalComment(index: number) {
  const comments = useCountStore.getState().finalComments
  const newComments = [...comments]
  newComments.splice(index, 1)
  useCountStore.setState({ finalComments: newComments })
}
export function resetUseCount() {
  useCountStore.setState(initialState)
}
/*





*/
export function Count() {
  return <CountStepsContainer />
}
/*





*/
type CountStepsPropsCreator<CountStepsProperties extends string> = {
  [key in CountStepsProperties as key]: CountStepProps
}
type CountStepsProps = CountStepsPropsCreator<CountSteps>
function CountStepsContainer() {
  const theme = useTheme()

  const countStep = useAppSelector(selectCountStep)
  const counterUuids = useAppSelector(selectCountersUuidList)
  const isCountCompleted = useAppSelector(selectIsStockCountCompleted)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const isOnlyOrganiser = useAppSelector(selectIsUserOnlyOrganiser)

  const countType = useCountStore((state) => state.tempCountType) as CountTypes
  const isCounterRequirementMet = useCountStore(
    (state) => state.isCounterRequirementMet,
  )
  const isReviewMetadataSubmitted = useCountStore(
    (state) => state.isReviewMetadataSubmitted,
  )
  const finalComments = useCountStore((state) => state.finalComments)

  useEffect(() => {
    if (isCountCompleted && isOrganiser && !isReviewMetadataSubmitted) {
      setUseCount("isReviewMetadataSubmitted", true)
      updateCountMetadata({ reviewStartTime: getTimeStamp() })
    }
  }, [isCountCompleted, isReviewMetadataSubmitted, isOrganiser])

  function handleSetupPrev() {
    updateCountStep("dashboard")
  }

  function handleSetupNext() {
    createCountMetadata(countType, counterUuids)
    updateCountStep("preparation")
  }

  function handlePreparationPrev() {
    updateCountStep("setup")
  }

  function handlePreparationNext() {
    setUseCount("isStartingCount", true)
  }

  function handleStockCountNext() {
    updateCountStep("review", true)
  }

  function handleReviewPrev() {
    updateCountStep("stockCount", true)
  }

  function handleReviewNext() {
    updateCountMetadata({ finalizationStartTime: getTimeStamp() })
    updateCountStep("finalization", true)
  }

  function handleFinalizationSubmit() {
    // setUseCount("isSubmittingFinalization", true)
    updateCountComments({ finalization: finalComments })
    updateCountMetadata({ finalSubmissionTime: getTimeStamp() })
    updateCountStep("review", true)
  }

  const isSetupNextButtonDisabled = !isCounterRequirementMet

  const countSteps: CountStepsProps = {
    dashboard: {
      label: "Dashboard",
      body: <DashboardBody />,
    },
    setup: {
      label: "Setup",
      body: <SetupBody />,
      prevButton: { label: "Dashboard", onClick: handleSetupPrev },
      nextButton: {
        label: "Preparation",
        onClick: handleSetupNext,
        disabled: isSetupNextButtonDisabled,
      },
    },
    preparation: {
      label: "Preparation",
      body: <PreparationBody />,
      prevButton: { label: "Setup", onClick: handlePreparationPrev },
      nextButton: { label: "Count", onClick: handlePreparationNext },
    },
    stockCount: {
      label: "Stock Count",
      body: <StockCountBody />,
      nextButton: { label: "Review", onClick: handleStockCountNext },
    },
    review: {
      label: "Review",
      body: <ReviewBody />,
    },
    finalization: {
      label: "Finalization",
      body: <FinalizationBody />,
      submitButton: { label: "Submit", onClick: handleFinalizationSubmit },
    },
  }

  if (!isOnlyOrganiser)
    _.set(countSteps, "review.prevButton", {
      label: "Count",
      onClick: handleReviewPrev,
    })

  if (isOrganiser)
    _.set(countSteps, "review.nextButton", {
      label: "Finalize",
      onClick: handleReviewNext,
      disabled: !isCountCompleted,
    })

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[4]}
      boxSizing={"border-box"}
    >
      <CountStep {...countSteps[countStep]} />
      <LeaveCountConfirmation />
      <DeleteCountConfirmation />
    </Stack>
  )
}
/*





*/
type CountStepProps = {
  label: string
  body: any
  nextButton?: ButtonProps
  prevButton?: ButtonProps
  submitButton?: ButtonProps
}
type ButtonProps = {
  label: string
  onClick: any
  disabled?: boolean
}
function CountStep(props: CountStepProps) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      gap={theme.module[3]}
      alignItems={"center"}
      boxSizing={"border-box"}
    >
      <Header {...props} />
      <Body {...props} />
      <ButtonTray {...props} />
    </Stack>
  )
}
/*





*/
function Header({ label }: { label: string }) {
  const theme = useTheme()

  const isOptionsOpen = useCountStore((state) => state.isCountOptionsOpen)

  return (
    <Stack
      direction={"row"}
      width={"100"}
      gap={theme.module[2]}
      padding={theme.module[2]}
      boxSizing={"border-box"}
      bgcolor={theme.scale.gray[9]}
      borderRadius={theme.module[5]}
      boxShadow={theme.shadow.neo[3]}
      sx={{
        outline: `1px solid ${theme.scale.gray[7]}`,
      }}
    >
      {isOptionsOpen ? <OptionsTray /> : <StepLabel label={label} />}
    </Stack>
  )
}
/*





*/
function StepLabel({ label }: { label: string }) {
  const theme = useTheme()
  const isUserCounting = useAppSelector(selectIsUserCounting)
  return (
    <Stack
      direction={"row"}
      gap={theme.module[2]}
      alignItems={"center"}
      paddingLeft={theme.module[4]}
      paddingRight={isUserCounting ? 0 : theme.module[4]}
      boxSizing={"border-box"}
      width={"100%"}
      height={"100%"}
    >
      <Typography fontWeight={"bold"} variant={"subtitle1"}>
        {label}
      </Typography>
      {isUserCounting && (
        <Button
          variation={"pill"}
          iconName={"options"}
          onClick={() => setUseCount("isCountOptionsOpen", true)}
        />
      )}
    </Stack>
  )
}
/*





*/
type CountOptions = {
  label?: string
  iconName: IconNames
  onClick: any
}
function OptionsTray() {
  const theme = useTheme()

  const isOptionsOpen = useCountStore((state) => state.isCountOptionsOpen)

  const [isOpen, setIsOpen] = useState(false)

  function handleCancel() {
    setIsOpen(false)
    setTimeout(() => {
      setUseCount("isCountOptionsOpen", false)
    }, 150)
  }

  useEffect(() => {
    if (!isOpen) {
      setIsOpen(isOptionsOpen)
    }
  }, [isOptionsOpen, isOpen])

  const options: CountOptions[] = [
    {
      label: "Leave",
      iconName: "leave",
      onClick: () => {
        setUseCount("isLeavingCount", true)
        handleCancel()
      },
    },
    {
      label: "Delete",
      iconName: "delete",
      onClick: () => {
        setUseCount("isDeletingCount", true)
        handleCancel()
      },
    },
    {
      iconName: "cancel",
      onClick: () => {
        handleCancel()
      },
    },
  ]

  return (
    <ClickAwayListener onClickAway={handleCancel}>
      <Stack
        direction={"row"}
        gap={theme.module[2]}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        padding={`0 ${theme.module[2]}`}
      >
        <Animation
          from={{ opacity: 0, width: "10rem" }}
          to={{ opacity: 1, width: "15rem" }}
          duration={150}
          start={isOpen}
        >
          <Stack
            direction={"row"}
            gap={theme.module[2]}
            alignItems={"center"}
            justifyContent={"center"}
            boxSizing={"border-box"}
          >
            {options.map((option) => (
              <Stack
                direction={"row"}
                gap={theme.module[1]}
                alignItems={"center"}
                key={option.iconName}
              >
                <Button
                  variation={"pill"}
                  iconName={option.iconName}
                  iconColor={theme.scale.green[6]}
                  label={option.label}
                  onClick={option.onClick}
                />
              </Stack>
            ))}
          </Stack>
        </Animation>
      </Stack>
    </ClickAwayListener>
  )
}
/*





*/
function Body({ body }: { body: any }) {
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      boxSizing={"border-box"}
      overflow={"hidden"}
      sx={{ overflowX: "visible", overflowY: "hidden" }}
    >
      {body}
    </Stack>
  )
}
/*





*/
function ButtonTray(props: CountStepProps) {
  const theme = useTheme()
  const showButtons = props.nextButton || props.prevButton || props.submitButton

  return (
    showButtons && (
      <Stack width={"100%"} direction={"row"} gap={theme.module[4]}>
        {props.prevButton && (
          <Button
            variation={"navPrev"}
            label={props.prevButton.label}
            onClick={props.prevButton.onClick}
            disabled={props.prevButton.disabled}
          />
        )}
        {props.nextButton && (
          <Button
            variation={"navNext"}
            label={props.nextButton.label}
            onClick={props.nextButton.onClick}
            disabled={props.nextButton.disabled}
          />
        )}
        {props.submitButton && (
          <Button
            variation={"profile"}
            label={props.submitButton.label}
            onClick={props.submitButton.onClick}
            disabled={props.submitButton.disabled}
            bgColor={theme.scale.gray[7]}
            outlineColor={theme.scale.gray[6]}
            justifyCenter
          />
        )}
      </Stack>
    )
  )
}
/*





*/
function LeaveCountConfirmation() {
  const isOpen = useCountStore((state) => state.isLeavingCount)

  function handleClose() {
    setUseCount("isLeavingCount", false)
  }

  function handleAccept() {
    updateUserCountMember({ isCounting: false })
    updateCountStep("dashboard")
    setUseCount("isLeavingCount", false)
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
  const dispatch = useAppDispatch()

  const isOpen = useCountStore((state) => state.isDeletingCount)

  function handleClose() {
    setUseCount("isDeletingCount", false)
  }

  function handleAccept() {
    updateCountStep("dashboard")
    resetUseCount()
    dispatch(deleteCount())
    setUseCount("isDeletingCount", false)
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
