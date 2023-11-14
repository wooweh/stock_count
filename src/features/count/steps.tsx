import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { getTimeStamp } from "../../common/utils"
import Animation from "../../components/animation"
import { Button } from "../../components/button"
import { IconNames } from "../../components/icon"
import { setCountUI, useCountUI } from "./count"
import { CountSteps, CountTypes } from "./countSlice"
import {
  selectCountStep,
  selectCountersUuidList,
  selectIsOrganiserFinalizing,
  selectIsStockCountCompleted,
  selectIsUserCounting,
  selectIsUserOnlyOrganiser,
  selectIsUserOrganiser,
} from "./countSliceSelectors"
import {
  createCountMetadata,
  updateCountComments,
  updateCountMetadata,
  updateCountStep,
} from "./countSliceUtils"
import { DashboardBody } from "./dashboard"
import { FinalizationBody } from "./finalization"
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

  const countStep = useAppSelector(selectCountStep)
  const counterUuids = useAppSelector(selectCountersUuidList)
  const isCountCompleted = useAppSelector(selectIsStockCountCompleted)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const isOnlyOrganiser = useAppSelector(selectIsUserOnlyOrganiser)
  const isFinalizing = useAppSelector(selectIsOrganiserFinalizing)

  const countType = useCountUI((state) => state.tempCountType) as CountTypes
  const isCounterRequirementMet = useCountUI(
    (state) => state.isCounterRequirementMet,
  )
  const isReviewMetadataSubmitted = useCountUI(
    (state) => state.isReviewMetadataSubmitted,
  )
  const finalComments = useCountUI((state) => state.finalComments)

  useEffect(() => {
    if (isCountCompleted && isOrganiser && !isReviewMetadataSubmitted) {
      updateCountMetadata({ reviewStartTime: getTimeStamp() }, true)
      setCountUI("isReviewMetadataSubmitted", true)
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

  if (!isOnlyOrganiser && !isFinalizing)
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
      bgcolor={theme.scale.gray[8]}
      padding={theme.module[4]}
      boxSizing={"border-box"}
    >
      <CountStep {...countSteps[countStep]} />
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
const STEP_LABEL_HEIGHT = "2rem"
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
          to={{ opacity: 1, width: isOrganiser ? "15rem" : "8.5rem" }}
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
