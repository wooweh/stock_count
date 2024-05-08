import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { getTimeStamp } from "../../common/utils"
import Animation from "../../components/animation"
import { Button } from "../../components/button"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import { IconNames } from "../../components/icon"
import { Slot, Window } from "../../components/surface"
import { resetCountUI, setCountUI, useCountUI } from "./count"
import { CountSteps, CountTypes } from "./countSlice"
import {
  selectCountStep,
  selectCountersUuidList,
  selectIsOrganiserFinalizing,
  selectIsStockCountCompleted,
  selectIsUserCounting,
  selectIsUserJustOrganiser,
  selectIsUserOrganiser,
} from "./countSliceSelectors"
import {
  createCountMetadata,
  removeCountMembers,
  updateCountComments,
  updateCountMetadata,
  updateCountStep,
} from "./countSliceUtils"
import { DashboardBody } from "./dashboard"
import { FinalizationBody } from "./finalization"
import { ManageCount } from "./manageCount"
import { PreparationBody } from "./preparation"
import { ReviewBody } from "./review"
import { SetupBody } from "./setup"
import { StockCountBody } from "./stockCount"
/*




*/
type CountStepsPropsCreator<CountStepsProperties extends string> = {
  [key in CountStepsProperties as key]: CountStepProps
}
type CountStepsProps = CountStepsPropsCreator<CountSteps>
export function Steps() {
  const theme = useTheme()
  const location = useLocation()

  const countStep = useAppSelector(selectCountStep)
  const counterUuids = useAppSelector(selectCountersUuidList)
  const isCountCompleted = useAppSelector(selectIsStockCountCompleted)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const isJustOrganiser = useAppSelector(selectIsUserJustOrganiser)
  const isFinalizing = useAppSelector(selectIsOrganiserFinalizing)

  const countUIState = useCountUI((state) => state)
  const isManagingCount = useCountUI((state) => state.isManagingCount)
  const countType = useCountUI((state) => state.tempCountType) as CountTypes
  const isCounterRequirementMet = useCountUI(
    (state) => state.isCounterRequirementMet,
  )
  const isReviewMetadataSubmitted = useCountUI(
    (state) => state.isReviewMetadataSubmitted,
  )
  const finalComments = useCountUI((state) => state.finalComments)

  const shouldUpdateReviewMetadata =
    isCountCompleted && isOrganiser && !isReviewMetadataSubmitted

  useEffect(() => {
    if (shouldUpdateReviewMetadata) updateReviewMetadata()
  }, [shouldUpdateReviewMetadata])

  function updateReviewMetadata() {
    updateCountMetadata({ reviewStartTime: getTimeStamp() }, true)
    setCountUI("isReviewMetadataSubmitted", true)
  }

  function handleSetupPrev() {
    updateCountStep("dashboard")
    removeCountMembers()
    resetCountUI()
  }

  function handleSetupNext() {
    createCountMetadata(countType, counterUuids)
    updateCountStep("preparation")
  }

  function handlePreparationPrev() {
    updateCountStep("setup")
  }

  function handlePreparationNext() {
    setCountUI("isStartingCount", true)
  }

  function handleStockCountNext() {
    updateCountStep("review", true)
  }

  function handleReviewPrev() {
    updateCountStep("stockCount", true)
  }

  function handleReviewNext() {
    setCountUI("isStartingFinalization", true)
  }

  function handleFinalizationSubmit() {
    updateCountComments({ finalization: finalComments }, true)
    updateCountMetadata({ finalSubmissionTime: getTimeStamp() }, true)
    setCountUI("isSubmittingFinalization", true)
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
        id: "count-preparation-button",
        label: "Preparation",
        onClick: handleSetupNext,
        disabled: isSetupNextButtonDisabled,
      },
    },
    preparation: {
      label: "Preparation",
      body: <PreparationBody />,
      prevButton: { label: "Setup", onClick: handlePreparationPrev },
      nextButton: {
        id: "count-start-count-button",
        label: "Count",
        onClick: handlePreparationNext,
      },
    },
    stockCount: {
      label: "Stock Count",
      body: <StockCountBody />,
      nextButton: {
        id: "count-review-button",
        label: "Review",
        onClick: handleStockCountNext,
      },
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

  if (!isJustOrganiser && !isFinalizing)
    _.set(countSteps, "review.prevButton", {
      label: "Count",
      onClick: handleReviewPrev,
    })

  if (isOrganiser)
    _.set(countSteps, "review.nextButton", {
      id: "count-finalize-button",
      label: "Finalize",
      onClick: handleReviewNext,
      disabled: !isCountCompleted,
    })

  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"Steps"}
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Window bgcolor={theme.scale.gray[8]} padding={theme.module[3]}>
        {isManagingCount ? (
          <ManageCount />
        ) : (
          <CountStep {...countSteps[countStep]} />
        )}
      </Window>
    </ErrorBoundary>
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
  id?: string
  label: string
  onClick: any
  disabled?: boolean
}
function CountStep(props: CountStepProps) {
  const theme = useTheme()

  return (
    <Window gap={theme.module[3]}>
      <Header {...props} />
      <Body {...props} />
      <ButtonTray {...props} />
    </Window>
  )
}
/*




*/
function Header({ label }: { label: string }) {
  const theme = useTheme()
  const isOptionsOpen = useCountUI((state) => state.isCountOptionsOpen)

  return (
    <Stack
      direction={"row"}
      width={"min-content"}
      gap={theme.module[2]}
      padding={theme.module[2]}
      boxSizing={"border-box"}
      bgcolor={theme.scale.gray[9]}
      borderRadius={theme.module[5]}
      sx={{
        outline: `2px solid ${theme.scale.gray[7]}`,
        outlineOffset: "-2px",
      }}
    >
      {isOptionsOpen ? <OptionsTray /> : <StepLabel label={label} />}
    </Stack>
  )
}
/*




*/
const STEP_LABEL_HEIGHT = "2rem"
function StepLabel({ label }: { label: string }) {
  const theme = useTheme()
  const isUserCounting = useAppSelector(selectIsUserCounting)

  return (
    <Fade>
      <Stack
        direction={"row"}
        gap={theme.module[2]}
        alignItems={"center"}
        paddingLeft={theme.module[4]}
        paddingRight={isUserCounting ? 0 : theme.module[4]}
        boxSizing={"border-box"}
        height={STEP_LABEL_HEIGHT}
      >
        <Typography fontWeight={"bold"} variant={"subtitle1"} noWrap>
          {label}
        </Typography>
        {isUserCounting && (
          <Button
            variation={"pill"}
            iconName={"options"}
            onClick={() => setCountUI("isCountOptionsOpen", true)}
          />
        )}
      </Stack>
    </Fade>
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

  const isOptionsOpen = useCountUI((state) => state.isCountOptionsOpen)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const step = useAppSelector(selectCountStep)

  const [isOpen, setIsOpen] = useState(false)

  function handleCancel() {
    setIsOpen(false)
    _.delay(() => setCountUI("isCountOptionsOpen", false), 150)
  }

  function handleLeave() {
    setCountUI("isLeavingCount", true)
    handleCancel()
  }

  function handleDelete() {
    setCountUI("isDeletingCount", true)
    handleCancel()
  }

  function handleManage() {
    setCountUI("isManagingCount", true)
    setCountUI("selectedMemberUuids", [])
    handleCancel()
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
      onClick: handleLeave,
    },
    {
      iconName: "cancel",
      onClick: handleCancel,
    },
  ]

  if (isOrganiser) {
    options.unshift({
      label: "Delete",
      iconName: "delete",
      onClick: handleDelete,
    })
  }

  const isFinalizing = step === "finalization"

  if (isOrganiser && !isFinalizing) {
    options.unshift({
      label: "Manage",
      iconName: "settings",
      onClick: handleManage,
    })
  }

  return (
    <ClickAwayListener onClickAway={handleCancel}>
      <Stack
        direction={"row"}
        gap={theme.module[2]}
        alignItems={"center"}
        width={"min-content"}
        height={STEP_LABEL_HEIGHT}
        padding={`0 ${theme.module[2]}`}
      >
        <Animation
          from={{ opacity: 0, width: "8.5rem" }}
          to={{
            opacity: 1,
            width: isOrganiser ? (isFinalizing ? "14rem" : "20rem") : "8.5rem",
          }}
          duration={150}
          start={isOpen}
        >
          <Slot gap={theme.module[2]}>
            {options.map((option) => (
              <Slot width={"min-content"} key={option.iconName}>
                <Button
                  variation={"pill"}
                  iconName={option.iconName}
                  label={option.label}
                  onClick={option.onClick}
                />
              </Slot>
            ))}
          </Slot>
        </Animation>
      </Stack>
    </ClickAwayListener>
  )
}
/*




*/
function Body({ body }: { body: any }) {
  return (
    <Window sx={{ overflowX: "visible", overflowY: "hidden" }}>{body}</Window>
  )
}
/*




*/
function ButtonTray(props: CountStepProps) {
  const theme = useTheme()
  const showButtons = props.nextButton || props.prevButton || props.submitButton

  return (
    showButtons && (
      <Slot gap={theme.module[4]}>
        {props.prevButton && (
          <Button
            id={props.prevButton.id}
            variation={"navPrev"}
            label={props.prevButton.label}
            onClick={props.prevButton.onClick}
            disabled={props.prevButton.disabled}
          />
        )}
        {props.nextButton && (
          <Button
            id={props.nextButton.id}
            variation={"navNext"}
            label={props.nextButton.label}
            onClick={props.nextButton.onClick}
            disabled={props.nextButton.disabled}
          />
        )}
        {props.submitButton && (
          <Button
            id="count-finalize-submit-button"
            variation={"profile"}
            label={props.submitButton.label}
            onClick={props.submitButton.onClick}
            disabled={props.submitButton.disabled}
            color={theme.scale.blue[6]}
            outlineColor={theme.scale.blue[7]}
            justifyCenter
          />
        )}
      </Slot>
    )
  )
}
/*




*/
