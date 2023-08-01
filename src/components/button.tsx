import ButtonBase from "@mui/material/ButtonBase"
import { useState } from "react"
import { SxProps } from "../common/types"
import useTheme from "../common/useTheme"
/*





*/
type ButtonVariations = "profile" | "modal" | "icon" | "home"
type AnimationDurations = 150 | 200
type ButtonProps = {
  variation: ButtonVariations
  animationDuration?: AnimationDurations
  children: any
  onClick: any
  disabled?: boolean
  sx?: SxProps
}
export function Button(props: ButtonProps) {
  const theme = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const [isThrottled, setIsThrottled] = useState(false)
  const duration = props.animationDuration ? props.animationDuration : 200

  if (isThrottled) setTimeout(() => setIsThrottled(false), duration)
  /*


*/
  function handleClick() {
    if (!isThrottled) {
      setIsThrottled(true)
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), duration / 2)
      setTimeout(() => props.onClick(), duration + 50)
    }
  }
  /*


*/
  const commonStyles = {
    transition: `transform ${duration / 2}ms, box-shadow ${duration / 2}ms`,
  }

  const VARIATIONS = {
    profile: {
      background: theme.scale.gray[8],
      padding: theme.module[4],
      color: theme.scale.gray[3],
      borderRadius: theme.module[3],
      width: "100%",
      outline: `2px solid ${theme.scale.gray[7]} !important`,
      transform: `scale(${isPressed ? 0.975 : 1})`,
      ...commonStyles,
      ...props.sx,
    },
    modal: {
      width: "100%",
      padding: theme.module[3],
      color: theme.scale.gray[4],
      background: theme.scale.gray[9],
      borderRadius: theme.module[3],
      transform: `scale(${isPressed ? 0.975 : 1})`,
      ...commonStyles,
      ...props.sx,
    },
    home: {
      background: theme.scale.gray[8],
      width: "100%",
      borderRadius: theme.module[3],
      boxShadow: theme.shadow.neo[isPressed ? 4 : 6],
      overflow: "hidden",
      justifyContent: "flex-start",
      transform: `scale(${isPressed ? 0.975 : 1})`,
      ...commonStyles,
      ...props.sx,
    },
    icon: {
      borderRadius: theme.module[5],
      padding: theme.module[2],
      transform: `scale(${isPressed ? 0.8 : 1})`,
      ...commonStyles,
      transition: "transform 250ms",
      ...props.sx,
    },
  }

  const styles = VARIATIONS[props.variation as keyof typeof VARIATIONS]

  return (
    <ButtonBase
      disableRipple
      onMouseDown={handleClick}
      disabled={props.disabled ? props.disabled : false}
      sx={styles}
    >
      {props.children}
    </ButtonBase>
  )
}
