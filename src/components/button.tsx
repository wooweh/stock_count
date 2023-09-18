import ButtonBase from "@mui/material/ButtonBase"
import { useState } from "react"
import useTheme from "../common/useTheme"
import Icon, { IconNames } from "./icon"
import { Stack, Typography } from "@mui/material"
/*





*/
type ButtonProps = {
  variation: ButtonVariations
  animationDuration?: AnimationDurations
} & Omit<ButtonVariationProps, "isPressed">
type AnimationDurations = 150 | 200
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

  if (isThrottled) setTimeout(() => setIsThrottled(false), duration)

  function handleClick() {
    if (!isThrottled) {
      setIsThrottled(true)
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), duration / 2)
      setTimeout(() => props.onClick(), duration + 50)
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
            fontSize={"large"}
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
    boxShadow: theme.shadow.neo[props.isPressed ? 3 : 6],
    overflow: "hidden",
    justifyContent: "flex-start",
    transform: `scale(${props.isPressed ? 0.99 : 1})`,
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
        direction={"row"}
        gap={theme.module[5]}
        alignItems={"center"}
        padding={theme.module[2]}
        boxSizing={"border-box"}
      >
        <Stack
          bgcolor={theme.scale.gray[9]}
          borderRadius={theme.module[2]}
          padding={theme.module[5]}
        >
          <Icon
            color={props.iconColor ?? theme.scale.gray[5]}
            variation={props.iconName as IconNames}
            fontSize="large"
          />
        </Stack>
        <Stack>
          <Typography color={theme.scale.gray[5]} variant="h5">
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
      onClick={props.onClick}
      disabled={props.disabled ?? false}
      disableRipple
      disableTouchRipple
      sx={styles}
    >
      <Stack direction={"row"} gap={theme.module[2]} alignContent={"center"}>
        {!!props.iconName && (
          <Icon
            variation={props.iconName}
            color={props.iconColor ?? theme.scale.gray[4]}
            fontSize={props.iconSize ?? "medium"}
          />
        )}
        {!!props.label && (
          <Typography color={props.color ?? theme.scale.gray[4]}>
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
