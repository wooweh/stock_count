import { Stack, Typography } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import MuiToggleButton from "@mui/material/ToggleButton"
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import _ from "lodash"
import { useState } from "react"
import useTheme from "../common/useTheme"
import Icon, { IconNames } from "./icon"
import { Slot, Window } from "./surface"
/*





*/
type ButtonProps = {
  variation: ButtonVariations
  animationDuration?: AnimationDurations
} & Omit<ButtonVariationProps, "isPressed">
type AnimationDurations = 0 | 150 | 200
type ButtonVariations =
  | "profile"
  | "modal"
  | "pill"
  | "home"
  | "navNext"
  | "navPrev"
type ButtonVariationProps = {
  label?: string
  iconName?: IconNames
  onClick: any
  disabled?: boolean
  disableTouchRipple?: boolean
  disableRipple?: boolean
  justifyCenter?: boolean
  bgColor?: string
  color?: string
  iconColor?: string
  iconSize?: "small" | "medium" | "large"
  outlineColor?: string
  boxShadowScale?: number
  sx?: any
}
export function Button(props: ButtonProps) {
  const theme = useTheme()
  const duration = props.animationDuration ? props.animationDuration : 150
  const throttleDuration = duration + 250

  const handleClick = _.throttle(
    (e: any) => {
      e.nativeEvent.stopImmediatePropagation()
      _.delay(() => props.onClick(e), duration + 50)
    },
    throttleDuration,
    { trailing: false },
  )

  const buttonProps = {
    ...props,
    sx: {
      ...props.sx,
      maxWidth: "450px",
    },
    onClick: handleClick,
  }

  const variations = {
    profile: <ProfileButton {...buttonProps} onClick={handleClick} />,
    modal: <ModalButton {...buttonProps} onClick={handleClick} />,
    home: <HomeButton {...buttonProps} onClick={handleClick} />,
    pill: <PillButton {...buttonProps} onClick={handleClick} />,
    navNext: (
      <NavigationButton navigateTo={"next"} {...props} onClick={handleClick} />
    ),
    navPrev: (
      <NavigationButton navigateTo={"prev"} {...props} onClick={handleClick} />
    ),
  }

  return variations[props.variation as keyof typeof variations]
}
/*





*/
function ProfileButton(props: ButtonVariationProps) {
  const theme = useTheme()

  const styles = {
    opacity: props.disabled ? 0.5 : 1,
    background: props.bgColor ?? theme.scale.gray[9],
    height: theme.module[7],
    padding: `${theme.module[4]} ${theme.module[5]}`,
    color: props.color ?? theme.scale.gray[3],
    borderRadius: theme.module[3],
    boxShadow: theme.shadow.neo[props.boxShadowScale ?? 3],
    width: "100%",
    outlineOffset: "-2px",
    outline: `2px solid ${
      props.outlineColor ?? theme.scale.gray[7]
    } !important`,
    ...props.sx,
  }

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableTouchRipple={props.disableTouchRipple ?? false}
      disableRipple={props.disableRipple ?? false}
      sx={styles}
    >
      <Window
        direction={"row"}
        justifyContent={props.justifyCenter ? "center" : "flex-start"}
        gap={props.justifyCenter ? theme.module[4] : theme.module[5]}
      >
        {!!props.iconName && (
          <Icon
            variation={props.iconName}
            fontSize={props.iconSize ?? "large"}
            color={props.iconColor}
          />
        )}
        {props.label && (
          <Typography variant="h6" color={props.color ?? theme.scale.gray[4]}>
            {props.label}
          </Typography>
        )}
      </Window>
    </ButtonBase>
  )
}
/*





*/
function ModalButton(props: ButtonVariationProps) {
  const theme = useTheme()

  const styles = {
    opacity: props.disabled ? 0.5 : 1,
    width: "100%",
    padding: theme.module[3],
    color: props.color ?? theme.scale.gray[4],
    outline: `2px solid ${
      props.outlineColor ?? theme.scale.gray[7]
    } !important`,
    outlineOffset: "-2px",
    background: props.bgColor ?? theme.scale.gray[8],
    borderRadius: theme.module[3],
    boxShadow: theme.shadow.neo[props.boxShadowScale ?? 3],
    ...props.sx,
  }

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableTouchRipple={props.disableTouchRipple ?? false}
      disableRipple={props.disableRipple ?? false}
      sx={styles}
    >
      <Stack direction={"row"} gap={theme.module[3]}>
        {!!props.iconName && <Icon variation={props.iconName} />}
        {!!props.label && <Typography>{props.label}</Typography>}
      </Stack>
    </ButtonBase>
  )
}
/*





*/
function HomeButton(props: ButtonVariationProps) {
  const theme = useTheme()
  const styles = {
    opacity: props.disabled ? 0.5 : 1,
    background: theme.scale.gray[9],
    width: "100%",
    borderRadius: theme.module[3],
    overflow: "visible",
    justifyContent: "flex-start",
    outline: `2px solid ${
      props.outlineColor ?? theme.scale.gray[6]
    } !important`,
    outlineOffset: "-2px",
    ...props.sx,
  }

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableTouchRipple={props.disableTouchRipple ?? false}
      disableRipple={props.disableRipple ?? false}
      sx={styles}
    >
      <Window height={"min-content"} gap={0}>
        <Window
          height={"min-content"}
          bgcolor={props.bgColor ?? theme.scale.gray[9]}
          borderRadius={`${theme.module[3]} ${theme.module[3]} 0 0`}
          padding={theme.module[5]}
        >
          <Icon
            color={props.iconColor ?? theme.scale.gray[5]}
            variation={props.iconName as IconNames}
            fontSize="large"
            sx={{
              transform: `scale(1.5)`,
            }}
          />
        </Window>
        <Window
          padding={theme.module[3]}
          bgcolor={theme.scale.gray[9]}
          height={"min-content"}
          borderRadius={theme.module[3]}
        >
          <Typography color={props.color ?? theme.scale.gray[5]} variant="h5">
            {props.label}
          </Typography>
        </Window>
      </Window>
    </ButtonBase>
  )
}
/*





*/
function PillButton(props: ButtonVariationProps) {
  const theme = useTheme()

  const styles = {
    opacity: props.disabled ? 0.5 : 1,
    borderRadius: theme.module[5],
    background: props.bgColor ?? "transparant",
    padding: props.label
      ? `${theme.module[2]} ${theme.module[3]}`
      : theme.module[2],
    outlineOffset: "-2px",
    outline: props.outlineColor
      ? `2px solid ${props.outlineColor} !important`
      : 0,
    transition: "transform 250ms",
    boxShadow:
      props.boxShadowScale !== undefined
        ? theme.shadow.neo[props.boxShadowScale]
        : "none",
    ...props.sx,
  }

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableTouchRipple={props.disableTouchRipple ?? false}
      disableRipple={props.disableRipple ?? false}
      sx={styles}
    >
      <Stack direction={"row"} gap={theme.module[2]} alignContent={"center"}>
        {!!props.iconName && (
          <Icon
            variation={props.iconName}
            color={props.disabled ? theme.scale.gray[4] : props.iconColor}
            fontSize={props.iconSize ?? "medium"}
          />
        )}
        {!!props.label && (
          <Typography
            color={
              props.disabled
                ? theme.scale.gray[4]
                : props.color ?? theme.scale.gray[4]
            }
            lineHeight={"1.5rem"}
            fontSize={"small"}
            fontWeight={"medium"}
          >
            {props.label}
          </Typography>
        )}
      </Stack>
    </ButtonBase>
  )
}
/*





*/
type NavigationButtonProps = ButtonVariationProps & {
  navigateTo: "next" | "prev"
}
export function NavigationButton(props: NavigationButtonProps) {
  const theme = useTheme()

  const styles = {
    opacity: props.disabled ? 0.5 : 1,
    width: "100%",
    height: theme.module[7],
    padding: theme.module[3],
    boxSizing: "border-box",
    color: theme.scale.gray[4],
    background: theme.scale.gray[9],
    borderRadius: theme.module[3],
    outlineOffset: "-2px",
    outline: `2px solid ${theme.scale.gray[6]} !important`,
    ...props.sx,
  }
  const iconName = props.navigateTo === "next" ? "arrowRight" : "arrowLeft"
  const elements = [
    <Icon fontSize="medium" variation={iconName} key={iconName} />,
    <Stack
      width={"100%"}
      justifyContent={"center"}
      flexShrink={1}
      key={props.label}
    >
      <Typography
        variant="body1"
        fontWeight={"bold"}
        color={theme.scale.gray[5]}
      >
        {props.label}
      </Typography>
    </Stack>,
  ]
  const buttonElements =
    props.navigateTo === "next" ? elements.reverse() : elements

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableTouchRipple={props.disableTouchRipple ?? false}
      disableRipple={props.disableRipple ?? false}
      sx={styles}
    >
      {buttonElements}
    </ButtonBase>
  )
}
/*





*/
export type ToggleButtonGroupProps = {
  options: ToggleButtonGroupOptionsProps[]
  initialAlignment?: string
}
export type ToggleButtonGroupOptionsProps = {
  label: string
  iconName: IconNames
  onClick: () => void
}
export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const theme = useTheme()
  const [alignment, setAlignment] = useState(props.initialAlignment ?? "")

  const handleAlignment = (event: any, newAlignment: string | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment)
    }
  }

  return (
    <Slot>
      <MuiToggleButtonGroup
        value={alignment}
        onChange={handleAlignment}
        exclusive
        fullWidth
      >
        {props.options.map((option) => (
          <MuiToggleButton
            value={option.label}
            onClick={option.onClick}
            disableFocusRipple
            disableTouchRipple
            disableRipple
            key={option.label}
          >
            <Icon
              variation={option.iconName}
              fontSize="large"
              color="inheret"
            />
          </MuiToggleButton>
        ))}
      </MuiToggleButtonGroup>
    </Slot>
  )
}
/*





*/
