import { Stack, Typography } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import MuiToggleButton from "@mui/material/ToggleButton"
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import _ from "lodash"
import { useState } from "react"
import useTheme from "../common/useTheme"
import Icon, { IconNames } from "./icon"
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
  isPressed: boolean
  disabled?: boolean
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
  const [isPressed, setIsPressed] = useState(false)
  const [isThrottled, setIsThrottled] = useState(false)
  const duration = props.animationDuration ? props.animationDuration : 150

  if (isThrottled) _.delay(() => setIsThrottled(false), duration)

  function handleClick() {
    if (!isThrottled) {
      setIsThrottled(true)
      setIsPressed(true)
      _.delay(() => setIsPressed(false), duration / 2)
      _.delay(() => props.onClick(), duration + 50)
    }
  }

  const commonStyles = {
    transition: `transform ${duration / 2}ms, box-shadow ${duration / 2}ms`,
  }

  const variations = {
    profile: (
      <ProfileButton
        isPressed={isPressed}
        {...props}
        onClick={handleClick}
        sx={{ ...commonStyles, ...props.sx }}
      />
    ),
    modal: (
      <ModalButton
        isPressed={isPressed}
        {...props}
        onClick={handleClick}
        sx={{ ...commonStyles, ...props.sx }}
      />
    ),
    home: (
      <HomeButton
        isPressed={isPressed}
        {...props}
        onClick={handleClick}
        sx={{ ...commonStyles, ...props.sx }}
      />
    ),
    pill: (
      <PillButton
        isPressed={isPressed}
        {...props}
        onClick={handleClick}
        sx={{ ...commonStyles, ...props.sx }}
      />
    ),
    navNext: (
      <NavigationButton
        navigateTo={"next"}
        isPressed={isPressed}
        {...props}
        onClick={handleClick}
        sx={{ ...commonStyles, ...props.sx }}
      />
    ),
    navPrev: (
      <NavigationButton
        navigateTo={"prev"}
        isPressed={isPressed}
        {...props}
        onClick={handleClick}
        sx={{ ...commonStyles, ...props.sx }}
      />
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
    background: props.bgColor ?? theme.scale.gray[8],
    height: theme.module[7],
    padding: `${theme.module[4]} ${theme.module[5]}`,
    color: props.color ?? theme.scale.gray[3],
    borderRadius: theme.module[3],
    boxShadow: theme.shadow.neo[props.boxShadowScale ?? 3],
    width: "100%",
    outlineOffset: "-1px",
    outline: `1px solid ${
      props.outlineColor ?? theme.scale.gray[7]
    } !important`,
    transform: `scale(${props.isPressed ? 0.975 : 1})`,
    ...props.sx,
  }

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableRipple
      disableTouchRipple
      sx={styles}
    >
      <Stack
        width={"100%"}
        height={"100%"}
        direction={"row"}
        alignItems={"center"}
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
      </Stack>
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
    outline: `1px solid ${
      props.outlineColor ?? theme.scale.gray[7]
    } !important`,
    outlineOffset: "-1px",
    background: props.bgColor ?? theme.scale.gray[8],
    borderRadius: theme.module[3],
    boxShadow: theme.shadow.neo[props.boxShadowScale ?? 3],
    transform: `scale(${props.isPressed ? 0.975 : 1})`,
    ...props.sx,
  }

  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableRipple
      disableTouchRipple
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
    background: theme.scale.gray[8],
    width: "100%",
    borderRadius: theme.module[3],
    overflow: "visible",
    justifyContent: "flex-start",
    transform: `scale(${props.isPressed ? 0.99 : 1})`,
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
      disableRipple
      disableTouchRipple
      sx={styles}
    >
      <Stack
        width={"100%"}
        direction={"column"}
        alignItems={"center"}
        boxSizing={"border-box"}
      >
        <Stack
          width={"100%"}
          alignItems={"center"}
          bgcolor={props.bgColor ?? theme.scale.gray[9]}
          borderRadius={`${theme.module[3]} ${theme.module[3]} 0 0`}
          padding={theme.module[5]}
          boxSizing={"border-box"}
        >
          <Icon
            color={props.iconColor ?? theme.scale.gray[5]}
            variation={props.iconName as IconNames}
            fontSize="large"
            sx={{
              transform: `scale(1.5)`,
            }}
          />
        </Stack>
        <Stack
          padding={theme.module[3]}
          bgcolor={theme.scale.gray[9]}
          boxSizing={"border-box"}
          width={"100%"}
          borderRadius={theme.module[3]}
        >
          <Typography color={props.color ?? theme.scale.gray[5]} variant="h5">
            {props.label}
          </Typography>
        </Stack>
      </Stack>
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
    outlineOffset: "-1px",
    outline: props.outlineColor
      ? `1px solid ${props.outlineColor} !important`
      : 0,
    transform: `scale(${props.isPressed ? 0.9 : 1})`,
    transition: "transform 250ms",
    boxShadow:
      props.boxShadowScale !== undefined
        ? theme.shadow.neo[props.boxShadowScale]
        : "none",
    ...props.sx,
  }

  return (
    <ButtonBase
      onMouseDown={props.onClick}
      disabled={props.disabled ?? false}
      disableRipple
      disableTouchRipple
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
    background: theme.scale.gray[7],
    borderRadius: theme.module[3],
    outlineOffset: "-1px",
    outline: `1px solid ${theme.scale.gray[6]} !important`,
    transform: `scale(${props.isPressed ? 0.99 : 1})`,
    ...props.sx,
  }
  const iconName = props.navigateTo === "next" ? "arrowRight" : "arrowLeft"
  const elements = [
    <Icon fontSize="large" variation={iconName} key={iconName} />,
    <Stack
      width={"100%"}
      justifyContent={"center"}
      flexShrink={1}
      key={props.label}
    >
      <Typography variant="h6" color={theme.scale.gray[4]}>
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
      disableRipple
      disableTouchRipple
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
    <Stack direction="row" width={"100%"}>
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
            sx={{
              background: theme.scale.gray[8],
              transition: "background 250ms",
            }}
          >
            <Icon variation={option.iconName} fontSize="large" />
          </MuiToggleButton>
        ))}
      </MuiToggleButtonGroup>
    </Stack>
  )
}
/*





*/
